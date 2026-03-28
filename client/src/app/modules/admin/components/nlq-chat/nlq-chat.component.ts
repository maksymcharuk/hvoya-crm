import { marked } from 'marked';
import { Subject, takeUntil } from 'rxjs';

import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { A2uiSurface } from '@shared/protocols/a2ui-surface';
import {
  AdminAnalyticsService,
  NlqMessage,
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
  /** Set while the agent is calling an analytics tool (AG-UI TOOL_CALL_START). */
  activeToolCall?: string;
  /** A2UI surface — populated as a2ui messages arrive; drives the visualization. */
  a2uiSurface?: A2uiSurface;
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
    private readonly cdr: ChangeDetectorRef,
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

    // Placeholder for the in-progress assistant message
    const assistantMsg: ChatMessage = {
      role: 'assistant',
      text: '',
      displayedText: '',
    };
    this.messages.push(assistantMsg);

    this.adminAnalyticsService
      .streamNlq({ question, conversationHistory: history })
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (evt) => {
          if (evt.protocol === 'agui') {
            const e = evt.event;

            if (e.type === 'TOOL_CALL_START') {
              // Show which tool the agent is calling while we wait for results
              assistantMsg.activeToolCall = e.toolName;
            }

            if (e.type === 'TOOL_CALL_END') {
              assistantMsg.activeToolCall = undefined;
            }

            if (e.type === 'TEXT_MESSAGE_CONTENT') {
              // AG-UI: append each streamed text delta
              assistantMsg.text += e.delta;
              this.ensureTypewriter(assistantMsg);
              this.shouldScrollToBottom = true;
            }

            if (e.type === 'RUN_FINISH' || e.type === 'RUN_ERROR') {
              if (e.type === 'RUN_ERROR') {
                assistantMsg.text = 'Виникла помилка. Спробуйте ще раз.';
                this.ensureTypewriter(assistantMsg);
              }
              assistantMsg.activeToolCall = undefined;
              this.loading = false;
              this.shouldScrollToBottom = true;
            }
          }

          if (evt.protocol === 'a2ui') {
            // A2UI: lazily create the surface and feed it each incoming message
            if (!assistantMsg.a2uiSurface) {
              assistantMsg.a2uiSurface = new A2uiSurface();
            }
            assistantMsg.a2uiSurface.processMessage(evt.event);
          }

          this.cdr.detectChanges();
        },
        error: () => {
          assistantMsg.text = 'Виникла помилка. Спробуйте ще раз.';
          this.ensureTypewriter(assistantMsg);
          assistantMsg.activeToolCall = undefined;
          this.loading = false;
          this.shouldScrollToBottom = true;
          this.cdr.detectChanges();
        },
        complete: () => {
          this.loading = false;
          this.cdr.detectChanges();
        },
      });
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.submit();
    }
  }

  /**
   * Resolves the A2UI surface for a message.
   * Returns { componentName, data } where componentName is the catalog entry
   * the agent selected (e.g. 'KpiGrid', 'DataTable', 'BarChart', 'LineChart').
   * The template renders by matching against those catalog names — no vizType string.
   */
  getA2uiViz(msg: ChatMessage): { componentName: string; data: unknown } | null {
    const root = msg.a2uiSurface?.getRootResolved();
    if (!root) return null;
    const dataJson = root.props['dataJson'] as Record<string, unknown> | undefined;
    if (!dataJson) return null;
    try {
      const data = JSON.parse(dataJson['json'] as string);
      return { componentName: root.componentName, data };
    } catch {
      return null;
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
    const num = Number(value);
    if (!isNaN(num) && typeof value === 'string' && value.includes('.')) {
      return num.toFixed(2);
    }
    return String(value);
  }

  buildChartData(data: unknown, vizType: 'bar' | 'line'): any {
    const d = data as any;
    const rows: any[] = d?.data ?? (Array.isArray(d) ? d : []);
    const s = getComputedStyle(document.documentElement);
    const blue = s.getPropertyValue('--blue-500').trim() || '#42A5F5';
    const green = s.getPropertyValue('--green-500').trim() || '#66BB6A';
    const red = s.getPropertyValue('--red-500').trim() || '#EF5350';
    const teal = s.getPropertyValue('--teal-500').trim() || '#26A69A';
    const orange = s.getPropertyValue('--orange-400').trim() || '#FFA726';
    const purple = s.getPropertyValue('--purple-400').trim() || '#AB47BC';

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

    const datasets = [
      { field: 'ordersCount', label: 'Замовлень', color: blue, numeric: false },
      {
        field: 'revenueAmount',
        label: 'Дохід (₴)',
        color: green,
        numeric: true,
      },
      {
        field: 'totalAmount',
        label: 'Заг. сума (₴)',
        color: orange,
        numeric: true,
      },
      {
        field: 'processedCount',
        label: 'Виконано',
        color: teal,
        numeric: false,
      },
      {
        field: 'returnedCount',
        label: 'Повернено',
        color: red,
        numeric: false,
      },
      {
        field: 'averageOrderValue',
        label: 'Сер. замовлення (₴)',
        color: purple,
        numeric: true,
      },
    ].filter((d) => ['ordersCount', 'revenueAmount'].includes(d.field));

    return {
      labels: rows.map((r) => r.month),
      datasets: datasets.map((d) => ({
        label: d.label,
        data: rows.map((r) => (d.numeric ? Number(r[d.field]) : r[d.field])),
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
    msg.isAnimating = true;

    const id = setInterval(() => {
      const fullText = msg.text;
      const current = msg.displayedText?.length ?? 0;
      if (current >= fullText.length) {
        msg.displayedText = fullText;
        msg.isAnimating = false;
        clearInterval(id);
      } else {
        const charsPerTick = Math.max(1, Math.ceil((fullText.length - current) / 12));
        msg.displayedText = fullText.slice(0, current + charsPerTick);
        this.shouldScrollToBottom = true;
      }
      this.cdr.detectChanges();
    }, 20);

    this.animationIntervals.push(id);
  }

  private ensureTypewriter(msg: ChatMessage) {
    if (msg.isAnimating) return;
    this.startTypewriter(msg);
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
