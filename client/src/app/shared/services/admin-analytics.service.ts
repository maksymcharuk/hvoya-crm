import { Observable, map } from 'rxjs';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AguiEvent } from '@shared/protocols/ag-ui.types';
import { A2uiMessage } from '@shared/protocols/a2ui.types';
import { TokenService } from './token.service';

export type NlqStreamEvent =
  | { protocol: 'agui'; event: AguiEvent }
  | { protocol: 'a2ui'; event: A2uiMessage };

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

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
  ) {}

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
   * Stream a natural language question over SSE.
   * Emits typed events from both the AG-UI and A2UI protocols.
   *
   * AG-UI events carry the conversational layer:
   *   RUN_START, TOOL_CALL_START/END, TEXT_MESSAGE_CONTENT (streamed), RUN_FINISH
   *
   * A2UI events carry declarative UI: component tree + data model for the visualization.
   */
  streamNlq(request: NlqRequest): Observable<NlqStreamEvent> {
    return new Observable((observer) => {
      const token = this.tokenService.getToken();
      let aborted = false;
      const controller = new AbortController();

      fetch(`${environment.apiUrl}/analytics/nlq/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(request),
        signal: controller.signal,
      })
        .then((response) => {
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          if (!response.body) throw new Error('No response body');

          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let buffer = '';

          const pump = (): Promise<void> =>
            reader.read().then(({ done, value }) => {
              if (done || aborted) {
                observer.complete();
                return;
              }

              buffer += decoder.decode(value, { stream: true });
              const blocks = buffer.split('\n\n');
              // Keep the last (possibly incomplete) block in the buffer
              buffer = blocks.pop() ?? '';

              for (const block of blocks) {
                let eventName = '';
                let dataLine = '';
                for (const line of block.split('\n')) {
                  if (line.startsWith('event: ')) eventName = line.slice(7).trim();
                  if (line.startsWith('data: ')) dataLine = line.slice(6);
                }
                if (!dataLine) continue;
                try {
                  const parsed = JSON.parse(dataLine);
                  if (eventName === 'agui') {
                    observer.next({ protocol: 'agui', event: parsed as AguiEvent });
                  } else if (eventName === 'a2ui') {
                    observer.next({ protocol: 'a2ui', event: parsed as A2uiMessage });
                  }
                } catch {
                  // malformed JSON — skip
                }
              }

              return pump();
            });

          return pump();
        })
        .catch((err) => {
          if (!aborted) observer.error(err);
        });

      // Teardown: abort the fetch when the Observable is unsubscribed
      return () => {
        aborted = true;
        controller.abort();
      };
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
