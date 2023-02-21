import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SkeletonModule } from 'primeng/skeleton';

import { CommonModule, registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import localeUk from '@angular/common/locales/uk';
import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { FormControlErrorMessageComponent } from './components/form-control-error-message/form-control-error-message.component';
import { OrderDeliveryStatusBadgeComponent } from './components/order-delivery-status-badge/order-delivery-status-badge.component';
import { OrderStatusBadgeComponent } from './components/order-status-badge/order-status-badge.component';
import { ProductItemComponent } from './components/product-item/product-item.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { StatusBadgeComponent } from './components/status-badge/status-badge.component';
import { VerticalMenuComponent } from './components/vertical-menu/vertical-menu.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { HttpExceptionInterceptor } from './interceptors/http-exception.interceptor';

registerLocaleData(localeUk);

const COMPONENTS = [
  VerticalMenuComponent,
  ProductListComponent,
  ProductItemComponent,
  FormControlErrorMessageComponent,
  StatusBadgeComponent,
  OrderStatusBadgeComponent,
  OrderDeliveryStatusBadgeComponent,
];

const PRIMENG_MODULES = [SelectButtonModule, SkeletonModule, ButtonModule];

@NgModule({
  declarations: [
    ...COMPONENTS,
    FormControlErrorMessageComponent,
    OrderDeliveryStatusBadgeComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    ...PRIMENG_MODULES,
  ],
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
    { provide: LOCALE_ID, useValue: 'uk' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'UAH' },
  ],
  exports: [...COMPONENTS],
})
export class SharedModule {}
