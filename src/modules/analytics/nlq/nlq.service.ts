import { randomUUID } from 'crypto';

import OpenAI from 'openai';
import type {
  ChatCompletionMessageFunctionToolCall,
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from 'openai/resources';
import { Response } from 'express';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AnalyticsDateRangeDto } from '@dtos/analytics/analytics-date-range.dto';
import { AnalyticsPageOptionsDto } from '@dtos/analytics/analytics-page-options.dto';

import { AnalyticsService } from '../services/analytics.service';
import { NlqMessageDto, NlqRequestDto, NlqResponseDto } from './nlq.dto';

const TOOLS: ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'getOrdersSummary',
      description:
        'Get overall order statistics: total revenue, average order value, order counts by status, conversion funnel (created → inProgress → fulfilled → returned). Use for high-level KPI questions.',
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
        'Get analytics per product: quantity sold, total revenue, unique dropshippers, average/min/max price. Best for tables or bar charts comparing products. Use order="ASC" with orderBy="quantitySold" for least popular products.',
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
          order: {
            type: 'string',
            enum: ['ASC', 'DESC'],
            description: 'Sort direction: DESC (default) for top/most, ASC for bottom/least',
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
          order: {
            type: 'string',
            enum: ['ASC', 'DESC'],
            description: 'Sort direction: DESC (default) for top/most, ASC for bottom/least',
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

Date range rules:
- Today's date is ${new Date().toISOString().slice(0, 10)}.
- ALWAYS pass \`from\` and \`to\` parameters whenever the user specifies any time period ("last month", "this year", "last 3 months", "за останній місяць", etc.).
- "Last month" means the previous calendar month (first day to last day). Example: if today is 2026-03-26, last month is from=2026-02-01 to=2026-02-28.
- "Last 30 days" means from=(today minus 30 days) to=today.
- Only omit date filters when the user explicitly asks for all-time data.

Formatting rules:
- Use markdown for structure (bold, lists, headings) when it improves readability.
- Do NOT draw tables or charts using text symbols (e.g. dashes, pipes, ASCII art). The UI renders data visually.
- A chart or table visualization will be automatically rendered alongside your response when appropriate.
  When a visualization is present, keep your text short — highlight only the 2-3 most important insights, notable trends, or actionable observations. Do NOT restate the raw numbers already visible in the chart or table.
  When no visualization applies (simple single-value answer, explanation, or clarification), write a full response.

Revenue and profitability rules:
- "Revenue", "income", "profit", "дохід", "виручка", "прибуток" always means money from completed orders only. Never include Cancelled, Refunded, or Refused orders in revenue figures.
- When using getOrdersByMonth, use the \`revenueAmount\` field (Fulfilled orders only) for any revenue or profitability question. Use \`totalAmount\` only if the user explicitly asks about total order volume including non-paid orders.
- When using getOrdersSummary, note that \`totalRevenue\` already filters for Fulfilled orders. The funnel fields are: \`created\` (all orders), \`inProgress\` (Processing + TransferedToDelivery), \`fulfilled\` (Fulfilled), \`returned\` (has return request). Return rate = returned / created * 100.

Data field units:
- \`averageProcessingTime\` is in **hours** (not minutes). Always state the unit as "годин" when reporting this value.

Sorting rules:
- For "least popular", "bottom", "найменш популярні" questions — use orderBy with order="ASC".
- For "most popular", "top", "найбільш популярні" questions — use orderBy with order="DESC".`;

/**
 * Prompt for A2UI component tree generation.
 * Describes the available catalog and instructs the LLM to output valid A2UI messages.
 */
const buildA2uiSystemPrompt = (surfaceId: string): string => `
You generate A2UI component trees to visualize analytics data.
Output ONLY a JSON object in this exact shape: {"messages": [...]}

Surface ID to use everywhere: ${surfaceId}
Catalog ID: hvoya-crm/v1

## When to skip visualization
If the data is a single scalar value, a yes/no answer, or visualization adds no clarity — return {"messages": []} and stop.

## Available components

### Standard catalog
Text:
  {"id":"t1","component":{"Text":{"text":{"literalString":"Hello"},"usageHint":"h3"}}}
  usageHint values: "h1" | "h2" | "h3" | "h4" | "h5" | "body" | "caption"

Row (horizontal flex):
  {"id":"r1","component":{"Row":{"children":{"explicitList":["id1","id2"]},"alignment":"stretch"}}}

Column (vertical flex):
  {"id":"c1","component":{"Column":{"children":{"explicitList":["id1","id2"]}}}}

Card (surface with padding/border):
  {"id":"k1","component":{"Card":{"child":"inner-id"}}}

Divider:
  {"id":"d1","component":{"Divider":{}}}

### Custom catalog
DataTable — renders records as a sortable table (use for products/dropshippers lists):
  {"id":"dt1","component":{"DataTable":{
    "columnsJson":{"literalString":"[{\\"field\\":\\"name\\",\\"header\\":\\"Назва\\"}]"},
    "rowsJson":{"literalString":"[{\\"name\\":\\"Product A\\",\\"revenue\\":1200}]"}
  }}}
  columnsJson: JSON-encoded array of {field: string, header: string}
  rowsJson:    JSON-encoded array of row objects

BarChart — vertical bar chart (use for product/dropshipper comparisons):
  {"id":"bc1","component":{"BarChart":{
    "labelsJson":{"literalString":"[\\"Продукт A\\",\\"Продукт B\\"]"},
    "datasetsJson":{"literalString":"[{\\"label\\":\\"Дохід\\",\\"data\\":[1200,800]}]"},
    "titleText":{"literalString":"Топ продуктів за доходом"}
  }}}
  labelsJson:   JSON-encoded string[]  (x-axis labels)
  datasetsJson: JSON-encoded {label: string, data: number[]}[]

LineChart — line chart (use for time-series: orders/revenue by month):
  {"id":"lc1","component":{"LineChart":{
    "labelsJson":{"literalString":"[\\"Січ\\",\\"Лют\\",\\"Бер\\"]"},
    "datasetsJson":{"literalString":"[{\\"label\\":\\"Замовлення\\",\\"data\\":[30,45,38]}]"},
    "titleText":{"literalString":"Динаміка замовлень"}
  }}}

PieChart — doughnut chart (use for status distributions or share breakdowns):
  {"id":"pc1","component":{"PieChart":{
    "labelsJson":{"literalString":"[\\"Fulfilled\\",\\"Cancelled\\"]"},
    "dataJson":{"literalString":"[70,30]"},
    "titleText":{"literalString":"Розподіл за статусом"}
  }}}
  labelsJson: JSON-encoded string[]
  dataJson:   JSON-encoded number[]  (one value per label)

## Visualization rules
- KPI / summary scalar metrics → Row of metric Cards (Text h3 for value + Text caption for label)
- Products or dropshippers list → DataTable  (prefer BarChart when top-N comparison is the focus)
- Time series (by month) → LineChart
- Status or category distribution → PieChart
- Never duplicate data across multiple component types in one response (e.g. don't add a DataTable AND a BarChart for the same dataset)

## Required message structure
[
  {"beginRendering":{"surfaceId":"${surfaceId}","catalogId":"hvoya-crm/v1","root":"root"}},
  {"surfaceUpdate":{"surfaceId":"${surfaceId}","components":[
    ...all component nodes...
  ]}}
]

Rules:
- The component with id "root" must exist and be listed last.
- Components reference children/child by id string, never by index.
- Column/Row children use: {"explicitList": ["id1","id2"]}
- Card child uses a plain string id: {"child": "inner-id"}
- All strings inside literalString must be valid JSON-escaped.
- Use Ukrainian for all label and title text.
`.trim();

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

    const firstResponse = await this.openai.chat.completions.create({
      model: 'gpt-5.4-nano',
      messages,
      tools: TOOLS,
      tool_choice: 'auto',
    });

    const firstChoice = firstResponse.choices[0]!.message;

    if (!firstChoice.tool_calls?.length) {
      return { answer: firstChoice.content ?? '', toolCalled: null, data: null };
    }

    const toolCall = firstChoice.tool_calls[0] as ChatCompletionMessageFunctionToolCall;
    const toolArgs = JSON.parse(toolCall.function.arguments || '{}') as Record<string, any>;
    const toolResult = await this.dispatchTool(toolCall.function.name, toolArgs);

    const secondResponse = await this.openai.chat.completions.create({
      model: 'gpt-5.4-nano',
      messages: [
        ...messages,
        firstChoice,
        { role: 'tool', tool_call_id: toolCall.id, content: JSON.stringify(toolResult) },
      ],
    });

    return {
      answer: secondResponse.choices[0]?.message.content ?? '',
      toolCalled: toolCall.function.name,
      data: toolResult,
    };
  }

  async stream(dto: NlqRequestDto, res: Response): Promise<void> {
    const emit = (eventName: string, data: unknown) => {
      res.write(`event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`);
    };

    try {
      emit('agui', { type: 'RUN_START' });

      const messages: ChatCompletionMessageParam[] = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...this.mapHistory(dto.conversationHistory),
        { role: 'user', content: dto.question },
      ];

      const firstResponse = await this.openai.chat.completions.create({
        model: 'gpt-5.4-nano',
        messages,
        tools: TOOLS,
        tool_choice: 'auto',
      });

      const firstChoice = firstResponse.choices[0]!.message;
      const messageId = 'msg-1';

      if (!firstChoice.tool_calls?.length) {
        emit('agui', { type: 'TEXT_MESSAGE_START', messageId });
        emit('agui', { type: 'TEXT_MESSAGE_CONTENT', messageId, delta: firstChoice.content ?? '' });
        emit('agui', { type: 'TEXT_MESSAGE_END', messageId });
        emit('agui', { type: 'RUN_FINISH' });
        return;
      }

      const toolCall = firstChoice.tool_calls[0] as ChatCompletionMessageFunctionToolCall;
      const toolName = toolCall.function.name;
      const toolArgs = JSON.parse(toolCall.function.arguments || '{}') as Record<string, any>;

      emit('agui', { type: 'TOOL_CALL_START', toolCallId: toolCall.id, toolName });
      const toolResult = await this.dispatchTool(toolName, toolArgs);
      emit('agui', { type: 'TOOL_CALL_END', toolCallId: toolCall.id });

      const surfaceId = `viz-${randomUUID()}`;
      const toolMessages: ChatCompletionMessageParam[] = [
        ...messages,
        firstChoice,
        { role: 'tool', tool_call_id: toolCall.id, content: JSON.stringify(toolResult) },
      ];

      // Run text streaming and A2UI generation in parallel to avoid extra latency
      const [streamResponse, a2uiMessages] = await Promise.all([
        this.openai.chat.completions.create({
          model: 'gpt-5.4-nano',
          messages: toolMessages,
          stream: true,
        }),
        this.generateA2uiMessages(dto.question, toolName, toolResult, surfaceId),
      ]);

      // Emit A2UI visualization first so it appears before the text
      for (const msg of a2uiMessages) {
        emit('a2ui', msg);
      }

      emit('agui', { type: 'TEXT_MESSAGE_START', messageId });

      for await (const chunk of streamResponse) {
        const delta = chunk.choices[0]?.delta?.content ?? '';
        if (delta) {
          emit('agui', { type: 'TEXT_MESSAGE_CONTENT', messageId, delta });
        }
      }

      emit('agui', { type: 'TEXT_MESSAGE_END', messageId });
      emit('agui', { type: 'RUN_FINISH' });
    } catch (err) {
      emit('agui', { type: 'RUN_ERROR', error: String(err) });
    } finally {
      res.end();
    }
  }

  /**
   * Calls the LLM to generate A2UI component tree messages for the given tool result.
   * Returns an empty array on any error so the main stream always completes.
   */
  private async generateA2uiMessages(
    question: string,
    toolName: string,
    toolResult: unknown,
    surfaceId: string,
  ): Promise<Record<string, unknown>[]> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-5.4-nano',
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: buildA2uiSystemPrompt(surfaceId) },
          {
            role: 'user',
            content: `Question: ${question}\nTool called: ${toolName}\nData: ${JSON.stringify(toolResult)}`,
          },
        ],
      });

      const raw = response.choices[0]?.message.content ?? '{}';
      const parsed = JSON.parse(raw) as { messages?: Record<string, unknown>[] };
      return Array.isArray(parsed.messages) ? parsed.messages : [];
    } catch {
      return [];
    }
  }

  private mapHistory(history?: NlqMessageDto[]): ChatCompletionMessageParam[] {
    if (!history?.length) return [];
    return history.map((m) => ({ role: m.role, content: m.content }));
  }

  private buildDateRangeQuery(args: { from?: string; to?: string }): AnalyticsDateRangeDto {
    const dto = new AnalyticsDateRangeDto();
    (dto as any).from = args.from ? new Date(args.from) : undefined;
    (dto as any).to = args.to ? new Date(args.to) : undefined;
    return dto;
  }

  private buildPageOptions(args: {
    take?: number;
    orderBy?: string;
    order?: string;
  }): AnalyticsPageOptionsDto {
    const dto = new AnalyticsPageOptionsDto();
    (dto as any).take = args.take ?? 10;
    (dto as any).page = 1;
    (dto as any).orderBy = args.orderBy;
    if (args.order === 'ASC' || args.order === 'DESC') {
      (dto as any).order = args.order;
    }
    return dto;
  }

  private async dispatchTool(name: string, args: Record<string, any>): Promise<unknown> {
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
        return this.analyticsService.getDropshippersAnalytics(query as any, pageOptions);
      default:
        return null;
    }
  }
}
