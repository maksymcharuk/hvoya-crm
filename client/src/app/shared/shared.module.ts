import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { HttpExceptionInterceptor } from './interceptors/http-exception.interceptor';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { VerticalMenuComponent } from './components/vertical-menu/vertical-menu.component';

@NgModule({
  declarations: [VerticalMenuComponent],
  imports: [CommonModule, HttpClientModule, RouterModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpExceptionInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  exports: [VerticalMenuComponent],
})
export class SharedModule {}
