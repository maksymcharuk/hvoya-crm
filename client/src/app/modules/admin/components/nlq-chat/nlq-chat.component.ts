import { Subject, takeUntil } from 'rxjs';

import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';

import {
  AdminAnalyticsService,
  NlqMessage,
  NlqResponse,
  VizType,
} from '@shared/services/admin-analytics.service';

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  data?: unknown;
  vizType?: VizType;
}

@Component({
  selector: 'app-nlq-chat',
  templateUrl: './nlq-chat.component.html',
  styleUrls: ['./nlq-chat.component.scss'],
})
export class NlqChatComponent implements OnDestroy, AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef<HTMLElement>;

  messages: ChatMessage[] = [];
  inputText = '';
  loading = false;

  private readonly destroyed$ = new Subject<void>();
  private shouldScrollToBottom = false;

  constructor(private readonly adminAnalyticsService: AdminAnalyticsService) {}

  submit() {
    const question = this.inputText.trim();
    if (!question || this.loading) return;

    this.inputText = '';
    this.messages.push({ role: 'user', text: question });
    this.loading = true;
    this.shouldScrollToBottom = true;

    const history: NlqMessage[] = this.messages
      .slice(0, -1)
      .slice(-10)
      .map((m) => ({ role: m.role, content: m.text }));

    this.adminAnalyticsService
      .queryNlq({ question, conversationHistory: history })
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (response: NlqResponse) => {
          this.messages.push({
            role: 'assistant',
            text: response.answer,
            data: response.data,
            vizType: response.vizType,
          });
          this.loading = false;
          this.shouldScrollToBottom = true;
        },
        error: () => {
          this.messages.push({
            role: 'assistant',
            text: 'Виникла помилка. Спробуйте ще раз.',
          });
          this.loading = false;
          this.shouldScrollToBottom = true;
        },
      });
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.submit();
    }
  }

  getTableRows(data: unknown): Record<string, unknown>[] {
    if (!data) return [];
    const d = data as any;
    const rows = d?.data ?? (Array.isArray(d) ? d : []);
    return rows.slice(0, 10);
  }

  getTableColumns(data: unknown): string[] {
    const rows = this.getTableRows(data);
    const first = rows[0];
    if (!first) return [];
    const exclude = new Set(['dropshipperId', 'productId']);
    return Object.keys(first).filter((k) => !exclude.has(k));
  }

  formatCellValue(value: unknown): string {
    if (value === null || value === undefined) return '—';
    // Decimal.js serializes to string; try to format numbers
    const num = Number(value);
    if (!isNaN(num) && typeof value === 'string' && value.includes('.')) {
      return num.toFixed(2);
    }
    return String(value);
  }

  buildChartData(data: unknown, vizType: 'bar' | 'line'): any {
    const d = data as any;
    const rows: any[] = d?.data ?? (Array.isArray(d) ? d : []);
    const documentStyle = getComputedStyle(document.documentElement);
    const blue = documentStyle.getPropertyValue('--blue-500') || '#42A5F5';
    const green = documentStyle.getPropertyValue('--green-500') || '#66BB6A';

    if (vizType === 'bar') {
      return {
        labels: rows.map((r) => r.status),
        datasets: [
          {
            label: 'К-ть замовлень',
            data: rows.map((r) => r.count),
            backgroundColor: blue,
          },
        ],
      };
    }

    return {
      labels: rows.map((r) => r.month),
      datasets: [
        {
          label: 'Замовлень',
          data: rows.map((r) => r.ordersCount),
          borderColor: blue,
          fill: false,
          tension: 0.4,
        },
        {
          label: 'Сума (₴)',
          data: rows.map((r) => Number(r.totalAmount)),
          borderColor: green,
          fill: false,
          tension: 0.4,
        },
      ],
    };
  }

  getChartOptions(): any {
    return { responsive: true, plugins: { legend: { position: 'bottom' } } };
  }

  getKpiEntries(data: unknown): { label: string; value: string }[] {
    if (!data) return [];
    const summary = (data as any)?.summary ?? {};
    const labels: Record<string, string> = {
      totalOrdersCount: 'Всього замовлень',
      totalRevenue: 'Загальний дохід',
      averageOrderValue: 'Середнє замовлення',
      averageProcessingTime: 'Час обробки (год)',
      completedOrdersCount: 'Виконано',
      cancelledOrdersCount: 'Скасовано',
      refundedOrdersCount: 'Повернено',
      refusedOrdersCount: 'Відмовлено',
    };
    return Object.entries(summary).map(([key, value]) => ({
      label: labels[key] ?? key,
      value: this.formatKpiValue(value),
    }));
  }

  private formatKpiValue(value: unknown): string {
    if (value === null || value === undefined) return '—';
    const num = Number(value);
    if (!isNaN(num)) return num.toFixed(2).replace(/\.00$/, '');
    return String(value);
  }

  clearChat() {
    this.messages = [];
  }

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      const el = this.messagesContainer?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
      this.shouldScrollToBottom = false;
    }
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
