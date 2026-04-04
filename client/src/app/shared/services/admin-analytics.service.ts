import type { Types } from '@a2ui/lit/0.8';
import type { AGUIEvent, CustomEvent } from '@ag-ui/core';
import { HttpAgent, randomUUID } from '@ag-ui/client';
import { Observable, map } from 'rxjs';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@environment/environment';
import { DropshipperAnalytics } from '@shared/interfaces/analystics/dropshipper-analytics.interface';
import {
  OrdersByMonthData,
  OrdersByStatusData,
  OrdersSummaryResponse,
} from '@shared/interfaces/analystics/orders-analytics.interface';
import { PaginatedResponse } from '@shared/interfaces/analystics/paginated-response.interface';
import {
  ProductAnalytics,
  ProductTimeline,
} from '@shared/interfaces/analystics/products-analytics.interface';

import { TokenService } from './token.service';

export type NlqStreamEvent =
  | { protocol: 'agui'; event: AGUIEvent }
  | { protocol: 'a2ui'; event: Types.ServerToClientMessage };

export type VizType = 'table' | 'bar' | 'line' | 'kpi';

export interface NlqMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface NlqRequest {
  question: string;
  conversationHistory?: NlqMessage[];
}

export interface NlqResponse {
  answer: string;
  toolCalled: string | null;
  data: unknown;
  vizType: VizType;
  vizFields?: string[];
}

export interface DateRange {
  from?: Date;
  to?: Date;
}

export interface PaginationOptions {
  page?: number;
  take?: number;
  orderBy?: string;
  order?: 'ASC' | 'DESC';
}

@Injectable({
  providedIn: 'root',
})
export class AdminAnalyticsService {
  private readonly baseUrl = `${environment.apiUrl}/analytics/admin`;

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  /**
   * Fetch dropshippers analytics with pagination and date filtering
   */
  getDropshippersAnalytics(
    dateRange?: DateRange,
    pagination?: PaginationOptions,
  ): Observable<PaginatedResponse<DropshipperAnalytics>> {
    let params = new HttpParams();

    if (dateRange?.from) {
      params = params.set('from', this.formatDate(dateRange.from));
    }
    if (dateRange?.to) {
      params = params.set('to', this.formatDate(dateRange.to));
    }
    if (pagination?.page) {
      params = params.set('page', pagination.page.toString());
    }
    if (pagination?.take) {
      params = params.set('take', pagination.take.toString());
    }
    if (pagination?.orderBy) {
      params = params.set('orderBy', pagination.orderBy);
    }
    if (pagination?.order) {
      params = params.set('order', pagination.order);
    }

    return this.http
      .get<PaginatedResponse<DropshipperAnalytics>>(
        `${this.baseUrl}/dropshippers`,
        { params },
      )
      .pipe(
        map((response) => ({
          data: response.data.map((item: DropshipperAnalytics) => ({
            ...item,
            lastOrderDate: item.lastOrderDate
              ? new Date(item.lastOrderDate)
              : null,
          })),
          meta: response.meta,
        })),
      );
  }

  /**
   * Fetch orders summary and funnel data
   */
  getOrdersSummary(dateRange?: DateRange): Observable<OrdersSummaryResponse> {
    let params = new HttpParams();

    if (dateRange?.from) {
      params = params.set('from', this.formatDate(dateRange.from));
    }
    if (dateRange?.to) {
      params = params.set('to', this.formatDate(dateRange.to));
    }

    return this.http.get<OrdersSummaryResponse>(
      `${this.baseUrl}/orders/summary`,
      { params },
    );
  }

  /**
   * Fetch orders data grouped by month
   */
  getOrdersByMonth(
    dateRange?: DateRange,
    pagination?: PaginationOptions,
  ): Observable<PaginatedResponse<OrdersByMonthData>> {
    let params = new HttpParams();

    if (dateRange?.from) {
      params = params.set('from', this.formatDate(dateRange.from));
    }
    if (dateRange?.to) {
      params = params.set('to', this.formatDate(dateRange.to));
    }
    if (pagination?.page) {
      params = params.set('page', pagination.page.toString());
    }
    if (pagination?.take) {
      params = params.set('take', pagination.take.toString());
    }

    return this.http.get<PaginatedResponse<OrdersByMonthData>>(
      `${this.baseUrl}/orders/by-month`,
      { params },
    );
  }

  /**
   * Fetch orders data grouped by status
   */
  getOrdersByStatus(dateRange?: DateRange): Observable<OrdersByStatusData[]> {
    let params = new HttpParams();

    if (dateRange?.from) {
      params = params.set('from', this.formatDate(dateRange.from));
    }
    if (dateRange?.to) {
      params = params.set('to', this.formatDate(dateRange.to));
    }

    return this.http.get<OrdersByStatusData[]>(
      `${this.baseUrl}/orders/by-status`,
      { params },
    );
  }

  /**
   * Fetch products analytics with pagination and date filtering
   */
  getProductsAnalytics(
    dateRange?: DateRange,
    pagination?: PaginationOptions,
  ): Observable<PaginatedResponse<ProductAnalytics>> {
    let params = new HttpParams();

    if (dateRange?.from) {
      params = params.set('from', this.formatDate(dateRange.from));
    }
    if (dateRange?.to) {
      params = params.set('to', this.formatDate(dateRange.to));
    }
    if (pagination?.page) {
      params = params.set('page', pagination.page.toString());
    }
    if (pagination?.take) {
      params = params.set('take', pagination.take.toString());
    }
    if (pagination?.orderBy) {
      params = params.set('orderBy', pagination.orderBy);
    }
    if (pagination?.order) {
      params = params.set('order', pagination.order);
    }

    return this.http.get<PaginatedResponse<ProductAnalytics>>(
      `${this.baseUrl}/products`,
      { params },
    );
  }

  /**
   * Fetch product timeline (price and orders history)
   */
  getProductTimeline(
    productId: string,
    dateRange?: DateRange,
  ): Observable<ProductTimeline> {
    let params = new HttpParams();

    if (dateRange?.from) {
      params = params.set('from', this.formatDate(dateRange.from));
    }
    if (dateRange?.to) {
      params = params.set('to', this.formatDate(dateRange.to));
    }

    return this.http.get<ProductTimeline>(
      `${this.baseUrl}/products/${productId}/timeline`,
      { params },
    );
  }

  /**
   * Send a natural language question to the AI analytics chat
   */
  queryNlq(request: NlqRequest): Observable<NlqResponse> {
    return this.http.post<NlqResponse>(
      `${environment.apiUrl}/analytics/nlq`,
      request,
    );
  }

  /**
   * Stream a natural language question over SSE using the official AG-UI HttpAgent.
   *
   * The backend emits standard AG-UI events as plain `data:` SSE lines.
   * A2UI visualization messages are embedded as CUSTOM events (name: 'a2ui')
   * and unpacked back into the { protocol: 'a2ui' } shape here.
   *
   * Note: we wrap agent.run() in a new Observable to bridge the RxJS instance
   * bundled inside @ag-ui/client with Angular's own RxJS instance.
   */
  streamNlq(request: NlqRequest): Observable<NlqStreamEvent> {
    const token = this.tokenService.getToken();

    const agent = new HttpAgent({
      url: `${environment.apiUrl}/analytics/nlq/stream`,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    // Build the RunAgentInput messages array: history + current question
    const history = (request.conversationHistory ?? []).map((m) => ({
      id: randomUUID(),
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));
    const input = {
      threadId: randomUUID(),
      runId: randomUUID(),
      context: [],
      tools: [],
      messages: [
        ...history,
        { id: randomUUID(), role: 'user' as const, content: request.question },
      ],
    };

    return new Observable<NlqStreamEvent>((observer) => {
      const sub = agent.run(input).subscribe({
        next: (event) => {
          // CUSTOM events with name 'a2ui' carry A2UI visualization messages
          if (event.type === 'CUSTOM' && (event as CustomEvent).name === 'a2ui') {
            observer.next({
              protocol: 'a2ui',
              event: (event as CustomEvent).value as Types.ServerToClientMessage,
            });
          } else {
            observer.next({ protocol: 'agui', event: event as AGUIEvent });
          }
        },
        error: (err) => observer.error(err),
        complete: () => observer.complete(),
      });

      return () => sub.unsubscribe();
    });
  }

  /**
   * Format date to YYYY-MM-DD string
   */
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
