import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DragDropModule } from 'primeng/dragdrop';
import { DropdownModule } from 'primeng/dropdown';
import { EditorModule } from 'primeng/editor';
import { GalleriaModule } from 'primeng/galleria';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { PanelModule } from 'primeng/panel';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';

import { CommonModule, registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import localeUk from '@angular/common/locales/uk';
import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AbilityModule } from '@casl/angular';

import { DeliveryServiceBadgeComponent } from './components/delivery-service-badge/delivery-service-badge.component';
import { FaqItemComponent } from './components/faq-item/faq-item.component';
import { FaqListComponent } from './components/faq-list/faq-list.component';
import { FormControlErrorMessageComponent } from './components/form-control-error-message/form-control-error-message.component';
import { OrderDeliveryStatusBadgeComponent } from './components/order-delivery-status-badge/order-delivery-status-badge.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { OrderStatusBadgeComponent } from './components/order-status-badge/order-status-badge.component';
import { OrderViewItemComponent } from './components/order-view-item/order-view-item.component';
import { ProductColorBadgeComponent } from './components/product-color-badge/product-color-badge.component';
import { ProductItemComponent } from './components/product-item/product-item.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductViewComponent } from './components/product-view/product-view.component';
import { StatusBadgeComponent } from './components/status-badge/status-badge.component';
import { StockBadgeComponent } from './components/stock-badge/stock-badge.component';
import { VerticalMenuComponent } from './components/vertical-menu/vertical-menu.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { HttpExceptionInterceptor } from './interceptors/http-exception.interceptor';
import {
  DeliveryServiceNamePipe,
  ProductSizePipe,
  RoleNamePipe,
} from './pipes';

registerLocaleData(localeUk);

const PIPES = [ProductSizePipe, DeliveryServiceNamePipe, RoleNamePipe];

const COMPONENTS = [
  VerticalMenuComponent,
  ProductListComponent,
  ProductItemComponent,
  FormControlErrorMessageComponent,
  StatusBadgeComponent,
  OrderStatusBadgeComponent,
  OrderDeliveryStatusBadgeComponent,
  OrderListComponent,
  OrderViewItemComponent,
  ProductViewComponent,
  FaqItemComponent,
  FaqListComponent,
  DeliveryServiceBadgeComponent,
  StockBadgeComponent,
  ProductColorBadgeComponent,
];

const PRIMENG_MODULES = [
  SelectButtonModule,
  SkeletonModule,
  ButtonModule,
  TableModule,
  DropdownModule,
  InputTextModule,
  GalleriaModule,
  PanelModule,
  MenuModule,
  DragDropModule,
  ConfirmDialogModule,
  DialogModule,
  EditorModule,
  BadgeModule,
];

@NgModule({
  declarations: [...COMPONENTS, ...PIPES],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    AbilityModule,
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
  exports: [...COMPONENTS, ...PIPES],
})
export class SharedModule {}
