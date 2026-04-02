import { marked } from 'marked';
import { Subject, takeUntil } from 'rxjs';

import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import {
  AdminAnalyticsService,
  NlqMessage,
  NlqResponse,
  VizType,
} from '@shared/services/admin-analytics.service';

const COLUMN_LABELS: Record<string, string> = {
  productName: 'Продукт',
  quantitySold: 'Продано (шт.)',
  totalRevenue: 'Дохід (₴)',
  uniqueDropshippersCount: 'Дропшиперів',
  averagePrice: 'Сер. ціна (₴)',
  minPrice: 'Мін. ціна (₴)',
  maxPrice: 'Макс. ціна (₴)',
  returnRate: 'Повернень (%)',
  name: "Ім'я",
  email: 'Email',
  ordersCount: 'Замовлень',
  averageOrderValue: 'Сер. замовлення (₴)',
  returnedAmount: 'Повернено (₴)',
  walletBalance: 'Баланс (₴)',
  lastOrderDate: 'Остання дата',
  lifetimeValue: 'LTV (₴)',
  status: 'Статус',
  count: 'К-ть',
  percentage: 'Частка (%)',
  month: 'Місяць',
  totalAmount: 'Заг. сума (₴)',
  revenueAmount: 'Дохід (₴)',
  processedCount: 'Виконано',
  returnedCount: 'Повернено',
};

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  displayedText?: string;
  isAnimating?: boolean;
  data?: unknown;
  vizType?: VizType;
  vizFields?: string[];
  chartData?: unknown;
}

@Component({
  standalone: false,
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
  private readonly animationIntervals: ReturnType<typeof setInterval>[] = [];

  readonly chartOptions = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } },
  };

  constructor(
    private readonly adminAnalyticsService: AdminAnalyticsService,
    private readonly sanitizer: DomSanitizer,
  ) {}

  renderMarkdown(text: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(marked.parse(text) as string);
  }

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
          const msg: ChatMessage = {
            role: 'assistant',
            text: response.answer,
            displayedText: '',
            isAnimating: true,
            data: response.data,
            vizType: response.vizType,
            vizFields: response.vizFields,
          };
          if (response.data && (response.vizType === 'bar' || response.vizType === 'line')) {
            msg.chartData = this.buildChartData(response.data, response.vizType, response.vizFields);
          }
          this.messages.push(msg);
          this.loading = false;
          this.shouldScrollToBottom = true;
          this.startTypewriter(msg);
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

  getTableColumns(data: unknown): { key: string; label: string }[] {
    const rows = this.getTableRows(data);
    const first = rows[0];
    if (!first) return [];
    const exclude = new Set(['dropshipperId', 'productId']);
    return Object.keys(first)
      .filter((k) => !exclude.has(k))
      .map((k) => ({ key: k, label: COLUMN_LABELS[k] ?? k }));
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

  buildChartData(data: unknown, vizType: 'bar' | 'line', vizFields?: string[]): any {
    const d = data as any;
    const rows: any[] = d?.data ?? (Array.isArray(d) ? d : []);
    const s = getComputedStyle(document.documentElement);
    const blue   = s.getPropertyValue('--blue-500').trim()   || '#42A5F5';
    const green  = s.getPropertyValue('--green-500').trim()  || '#66BB6A';
    const red    = s.getPropertyValue('--red-500').trim()    || '#EF5350';
    const teal   = s.getPropertyValue('--teal-500').trim()   || '#26A69A';
    const orange = s.getPropertyValue('--orange-400').trim() || '#FFA726';
    const purple = s.getPropertyValue('--purple-400').trim() || '#AB47BC';

    if (vizType === 'bar') {
      return {
        labels: rows.map((r) => r.status),
        datasets: [{ label: 'К-ть замовлень', data: rows.map((r) => r.count), backgroundColor: blue }],
      };
    }

    const ALL_LINE_DATASETS = [
      { field: 'ordersCount',       label: 'Замовлень',             color: blue,   numeric: false },
      { field: 'revenueAmount',     label: 'Дохід (₴)',             color: green,  numeric: true  },
      { field: 'totalAmount',       label: 'Заг. сума (₴)',         color: orange, numeric: true  },
      { field: 'processedCount',    label: 'Виконано',              color: teal,   numeric: false },
      { field: 'returnedCount',     label: 'Повернено',             color: red,    numeric: false },
      { field: 'averageOrderValue', label: 'Сер. замовлення (₴)',   color: purple, numeric: true  },
    ];

    const active = vizFields?.length
      ? ALL_LINE_DATASETS.filter((d) => vizFields.includes(d.field))
      : ALL_LINE_DATASETS.filter((d) => ['ordersCount', 'revenueAmount'].includes(d.field));

    return {
      labels: rows.map((r) => r.month),
      datasets: active.map((d) => ({
        label: d.label,
        data: rows.map((r) => d.numeric ? Number(r[d.field]) : r[d.field]),
        borderColor: d.color,
        fill: false,
        tension: 0.4,
      })),
    };
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

  private startTypewriter(msg: ChatMessage) {
    const fullText = msg.text;
    const charsPerTick = Math.max(1, Math.ceil(fullText.length / 50));

    const id = setInterval(() => {
      const current = msg.displayedText?.length ?? 0;
      if (current >= fullText.length) {
        msg.displayedText = fullText;
        msg.isAnimating = false;
        clearInterval(id);
      } else {
        msg.displayedText = fullText.slice(0, current + charsPerTick);
        this.shouldScrollToBottom = true;
      }
    }, 20);

    this.animationIntervals.push(id);
  }

  clearChat() {
    this.animationIntervals.forEach(clearInterval);
    this.animationIntervals.length = 0;
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
    this.animationIntervals.forEach(clearInterval);
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
