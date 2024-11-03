import { Observable } from 'rxjs';

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@environment/environment';
import { TokenService } from '@shared/services/token.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(public tokenService: TokenService) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    if (request.url.includes(environment.apiUrl)) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.tokenService.getToken()}`,
        },
      });
    }
    return next.handle(request);
  }
}
