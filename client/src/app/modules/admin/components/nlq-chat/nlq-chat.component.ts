import { MessageProcessor } from '@a2ui/angular';
// Import types from the same web_core instance @a2ui/angular uses internally
import type { Types } from '@a2ui/lit/0.8';
import { marked } from 'marked';
import { Subject, takeUntil } from 'rxjs';

import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  inject,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import {
  AdminAnalyticsService,
  NlqMessage,
} from '@shared/services/admin-analytics.service';

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  displayedText?: string;
  isAnimating?: boolean;
  /** Set while the agent is calling an analytics tool (AG-UI TOOL_CALL_START). */
  activeToolCall?: string;
  /** SurfaceId assigned to this assistant turn by the backend beginRendering message. */
  a2uiSurfaceId?: string;
  /** Live surface reference from the global MessageProcessor. */
  a2uiSurface?: Types.Surface | null;
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

  private readonly processor = inject(MessageProcessor);
  private readonly adminAnalyticsService = inject(AdminAnalyticsService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly cdr = inject(ChangeDetectorRef);

  private readonly destroyed$ = new Subject<void>();
  private shouldScrollToBottom = false;
  private readonly animationIntervals: ReturnType<typeof setInterval>[] = [];

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
              assistantMsg.activeToolCall = e.toolName;
            }

            if (e.type === 'TOOL_CALL_END') {
              assistantMsg.activeToolCall = undefined;
            }

            if (e.type === 'TEXT_MESSAGE_CONTENT') {
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
            try {
              const msg = evt.event as Types.ServerToClientMessage;

              // Capture surfaceId from the first beginRendering message
              if ('beginRendering' in msg && !assistantMsg.a2uiSurfaceId) {
                assistantMsg.a2uiSurfaceId = msg.beginRendering?.surfaceId;
              }

              // Cast through unknown to bridge the two web_core version instances
              this.processor.processMessages([msg as unknown as Parameters<typeof this.processor.processMessages>[0][number]]);

              if (assistantMsg.a2uiSurfaceId) {
                assistantMsg.a2uiSurface = (
                  this.processor.getSurfaces().get(assistantMsg.a2uiSurfaceId) ?? null
                ) as Types.Surface | null;
              }
            } catch {
              // ignore malformed A2UI messages
            }
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
}
