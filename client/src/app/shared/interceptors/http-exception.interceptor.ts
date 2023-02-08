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

@Injectable()
export class HttpExceptionInterceptor implements HttpInterceptor {
  constructor(private readonly messageService: MessageService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap({
        next: () => null,
        error: (err: HttpErrorResponse) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Something went wrong.',
            detail: err.error.message,
          });
        },
      }),
    );
  }
}
