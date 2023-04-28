import { MessageService } from 'primeng/api';
import { Observable, tap } from 'rxjs';

import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '@shared/services/auth.service';

@Injectable()
export class HttpExceptionInterceptor implements HttpInterceptor {
  constructor(
    private readonly messageService: MessageService,
    private authService: AuthService,
    private router: Router,
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap({
        next: () => null,
        error: (err: HttpErrorResponse) => {
          if (err.status === 406) {
            this.messageService.add({
              severity: 'error',
              summary:
                'Вибачте, ваш акаунт тимчасово призупинено. Зверніться до менеджера за більш детальною інформацією.',
              detail: err.error.message,
            });
            this.authService.logout();
            this.router.navigateByUrl('auth/freezed');
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Виникла помилка.',
              detail: err.error.message,
            });
          }
        },
      }),
    );
  }
}
