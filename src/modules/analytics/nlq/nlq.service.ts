import OpenAI from 'openai';
import type {
  ChatCompletionMessageFunctionToolCall,
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from 'openai/resources';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AnalyticsDateRangeDto } from '@dtos/analytics/analytics-date-range.dto';
import { AnalyticsPageOptionsDto } from '@dtos/analytics/analytics-page-options.dto';

import { AnalyticsService } from '../services/analytics.service';
import {
  NlqMessageDto,
  NlqRequestDto,
  NlqResponseDto,
  VizType,
} from './nlq.dto';

const TOOLS: ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'getOrdersSummary',
      description:
        'Get overall order statistics: total revenue, average order value, order counts by status, conversion funnel. Use for high-level KPI questions.',
      parameters: {
        type: 'object',
        properties: {
          from: {
            type: 'string',
            description: 'Start date ISO string (e.g. 2024-01-01)',
          },
          to: {
            type: 'string',
            description: 'End date ISO string (e.g. 2024-12-31)',
          },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'getOrdersByMonth',
      description:
        'Get orders aggregated by month: ordersCount (all orders), totalAmount (all orders including cancelled/refunded/refused), revenueAmount (only Fulfilled orders — use this for revenue/profit questions), processedCount (fulfilled count), returnedCount, averageOrderValue. Best for trend/timeline bar or line charts.',
      parameters: {
        type: 'object',
        properties: {
          from: { type: 'string', description: 'Start date ISO string' },
          to: { type: 'string', description: 'End date ISO string' },
          take: {
            type: 'number',
            description: 'Max months to return (default 12)',
          },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'getOrdersByStatus',
      description:
        'Get orders grouped by status with count, percentage, and revenue per status. Best for pie/bar charts showing status distribution.',
      parameters: {
        type: 'object',
        properties: {
          from: { type: 'string', description: 'Start date ISO string' },
          to: { type: 'string', description: 'End date ISO string' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'getProductsAnalytics',
      description:
        'Get analytics per product: quantity sold, total revenue, unique dropshippers, average/min/max price. Best for tables or bar charts comparing products.',
      parameters: {
        type: 'object',
        properties: {
          from: { type: 'string', description: 'Start date ISO string' },
          to: { type: 'string', description: 'End date ISO string' },
          take: {
            type: 'number',
            description: 'Number of products to return (default 10)',
          },
          orderBy: {
            type: 'string',
            enum: ['totalRevenue', 'quantitySold', 'averagePrice'],
            description: 'Field to sort products by',
          },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'getDropshippersAnalytics',
      description:
        'Get analytics per dropshipper: total revenue, order count, average order value, return rate, wallet balance. Best for tables comparing dropshippers.',
      parameters: {
        type: 'object',
        properties: {
          from: { type: 'string', description: 'Start date ISO string' },
          to: { type: 'string', description: 'End date ISO string' },
          take: {
            type: 'number',
            description: 'Number of dropshippers to return (default 10)',
          },
          orderBy: {
            type: 'string',
            enum: [
              'totalRevenue',
              'ordersCount',
              'returnRate',
              'returnedCount',
              'walletBalance',
            ],
            description: 'Field to sort dropshippers by. Use returnedCount for questions about number of returned orders, returnRate for percentage-based return questions.',
          },
        },
      },
    },
  },
];

const SYSTEM_PROMPT = `You are an analytics assistant for Hvoya CRM, a dropshipping business management platform.
Always respond in Ukrainian regardless of the language used in the question.
You have access to analytics tools that query the database. When a user asks a question about orders, revenue, products, or dropshippers, call the appropriate tool to get the data, then provide a concise answer.
Always call a tool before answering data questions. Do not fabricate numbers.
After receiving tool results, summarize the key insights clearly and briefly.

Formatting rules:
- Use markdown for structure (bold, lists, headings) when it improves readability.
- Do NOT draw tables or charts using text symbols (e.g. dashes, pipes, ASCII art). The UI renders data visually as charts and tables automatically — just describe the insights in text.

Revenue and profitability rules:
- "Revenue", "income", "profit", "дохід", "виручка", "прибуток" always means money from completed orders only. Never include Cancelled, Refunded, or Refused orders in revenue figures.
- When using getOrdersByMonth, use the \`revenueAmount\` field (Fulfilled orders only) for any revenue or profitability question. Use \`totalAmount\` only if the user explicitly asks about total order volume including non-paid orders.
- When using getOrdersSummary, note that \`totalRevenue\` already filters for Fulfilled orders.`;

const VIZ_TYPE_MAP: Record<string, VizType> = {
  getOrdersSummary: 'kpi',
  getOrdersByMonth: 'line',
  getOrdersByStatus: 'bar',
  getProductsAnalytics: 'table',
  getDropshippersAnalytics: 'table',
};

@Injectable()
export class NlqService {
  private readonly openai: OpenAI;

  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly configService: ConfigService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async query(dto: NlqRequestDto): Promise<NlqResponseDto> {
    const messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...this.mapHistory(dto.conversationHistory),
      { role: 'user', content: dto.question },
    ];

    // First LLM call — may produce a tool_call
    const firstResponse = await this.openai.chat.completions.create({
      model: 'gpt-5.4-nano',
      messages,
      tools: TOOLS,
      tool_choice: 'auto',
    });

    const firstChoice = firstResponse.choices[0]!.message;

    if (!firstChoice.tool_calls?.length) {
      // No tool called — direct answer
      return {
        answer: firstChoice.content ?? '',
        toolCalled: null,
        data: null,
        vizType: 'kpi',
      };
    }

    const toolCall = firstChoice
      .tool_calls[0] as ChatCompletionMessageFunctionToolCall;
    const toolName = toolCall.function.name;
    const toolArgs = JSON.parse(toolCall.function.arguments || '{}') as Record<
      string,
      any
    >;

    const toolResult = await this.dispatchTool(toolName, toolArgs);

    // Second LLM call — summarize the tool result
    const secondResponse = await this.openai.chat.completions.create({
      model: 'gpt-5.4-nano',
      messages: [
        ...messages,
        firstChoice,
        {
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify(toolResult),
        },
        {
          role: 'system',
          content:
            'After your answer, if the tool was getOrdersByMonth, add a final line in the exact format "VIZ: field1,field2" listing only the data fields most relevant to the user\'s question. ' +
            'Available fields: ordersCount, totalAmount, revenueAmount, processedCount, returnedCount, averageOrderValue. ' +
            'Example: "VIZ: returnedCount" for a question about returns, "VIZ: revenueAmount" for revenue. ' +
            'Omit the VIZ line for all other tools.',
        },
      ],
    });

    const secondChoice = secondResponse.choices[0];
    const rawContent = secondChoice?.message.content ?? '';

    // Extract optional VIZ: marker and strip it from the visible answer
    const vizMatch = rawContent.match(/\nVIZ:\s*([^\n]+)/);
    const vizFields = vizMatch
      ? vizMatch[1]!
          .split(',')
          .map((f) => f.trim())
          .filter(Boolean)
      : undefined;
    const answer = rawContent.replace(/\nVIZ:[^\n]*/g, '').trim();

    return {
      answer,
      toolCalled: toolName,
      data: toolResult,
      vizType: VIZ_TYPE_MAP[toolName] ?? 'table',
      vizFields,
    };
  }

  private mapHistory(history?: NlqMessageDto[]): ChatCompletionMessageParam[] {
    if (!history?.length) return [];
    return history.map((m) => ({ role: m.role, content: m.content }));
  }

  private buildDateRangeQuery(args: {
    from?: string;
    to?: string;
  }): AnalyticsDateRangeDto {
    const dto = new AnalyticsDateRangeDto();
    (dto as any).from = args.from ? new Date(args.from) : undefined;
    (dto as any).to = args.to ? new Date(args.to) : undefined;
    return dto;
  }

  private buildPageOptions(args: {
    take?: number;
    orderBy?: string;
  }): AnalyticsPageOptionsDto {
    const dto = new AnalyticsPageOptionsDto();
    (dto as any).take = args.take ?? 10;
    (dto as any).page = 1;
    (dto as any).orderBy = args.orderBy;
    return dto;
  }

  private async dispatchTool(
    name: string,
    args: Record<string, any>,
  ): Promise<unknown> {
    const query = this.buildDateRangeQuery(args);
    const pageOptions = this.buildPageOptions(args);

    switch (name) {
      case 'getOrdersSummary':
        return this.analyticsService.getOrdersSummary(query);
      case 'getOrdersByMonth':
        return this.analyticsService.getOrdersByMonth(query, pageOptions);
      case 'getOrdersByStatus':
        return this.analyticsService.getOrdersByStatus(query);
      case 'getProductsAnalytics':
        return this.analyticsService.getProductsAnalytics(query, pageOptions);
      case 'getDropshippersAnalytics':
        return this.analyticsService.getDropshippersAnalytics(
          query as any,
          pageOptions,
        );
      default:
        return null;
    }
  }
}
