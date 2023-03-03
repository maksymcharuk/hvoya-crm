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

import { AuthService } from '@shared/services/auth.service';

@Injectable()
export class HttpExceptionInterceptor implements HttpInterceptor {
  constructor(
    private readonly messageService: MessageService,
    private authService: AuthService,
  ) { }

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
              summary: 'Ваш аккаунт заморожено.',
              detail: err.error.message,
            });
            this.authService.logout();
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Something went wrong.',
              detail: err.error.message,
            });
          }
        },
      }),
    );
  }
}
