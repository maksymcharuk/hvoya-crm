import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ChartModule } from 'primeng/chart';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DragDropModule } from 'primeng/dragdrop';
import { DropdownModule } from 'primeng/dropdown';
import { EditorModule } from 'primeng/editor';
import { GalleriaModule } from 'primeng/galleria';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { MultiSelectModule } from 'primeng/multiselect';
import { PanelModule } from 'primeng/panel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

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
import { ImageComponentComponent } from './components/image-component/image-component.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { OrderDeliveryStatusBadgeComponent } from './components/order-delivery-status-badge/order-delivery-status-badge.component';
import { OrderListItemComponent } from './components/order-list/order-list-item/order-list-item.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { OrderStatusBadgeComponent } from './components/order-status-badge/order-status-badge.component';
import { OrderViewItemComponent } from './components/order-view-item/order-view-item.component';
import { OrdersChartComponent } from './components/orders-chart/orders-chart.component';
import { ProductColorBadgeComponent } from './components/product-color-badge/product-color-badge.component';
import { ProductItemComponent } from './components/product-item/product-item.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductViewComponent } from './components/product-view/product-view.component';
import { RequestListItemComponent } from './components/request-list/request-list-item/request-list-item.component';
import { RequestListComponent } from './components/request-list/request-list.component';
import { RequestStatusBadgeComponent } from './components/request-status-badge/request-status-badge.component';
import { ReturnRequestDeliveryStatusBadgeComponent } from './components/return-request-delivery-status-badge/return-request-delivery-status-badge.component';
import { ReturnRequestItemListComponent } from './components/return-request-item-list/return-request-item-list.component';
import { ReturnRequestOrderItemComponent } from './components/return-request-order-item/return-request-order-item.component';
import { ReturnRequestViewItemComponent } from './components/return-request-view-item/return-request-view-item.component';
import { StatusBadgeComponent } from './components/status-badge/status-badge.component';
import { StockBadgeComponent } from './components/stock-badge/stock-badge.component';
import { TransactionsListComponent } from './components/transactions-list/transactions-list.component';
import { VerticalMenuComponent } from './components/vertical-menu/vertical-menu.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { HttpExceptionInterceptor } from './interceptors/http-exception.interceptor';
import {
  DateAgoPipe,
  DeliveryServiceNamePipe,
  PhoneNumberPipe,
  ProductPackageSize,
  ProductSizePipe,
  ProductWeight,
  RequestTypePipe,
  RoleNamePipe,
  TransactionStatusPipe,
  TransactionSyncOneCStatusPipe,
} from './pipes';

registerLocaleData(localeUk);

const PIPES = [
  ProductSizePipe,
  DeliveryServiceNamePipe,
  RoleNamePipe,
  PhoneNumberPipe,
  TransactionStatusPipe,
  DateAgoPipe,
  TransactionSyncOneCStatusPipe,
  ProductPackageSize,
  ProductWeight,
  RequestTypePipe,
];

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
  NotificationsComponent,
  TransactionsListComponent,
  OrderListItemComponent,
  ImageComponentComponent,
  OrdersChartComponent,
  RequestListComponent,
  RequestStatusBadgeComponent,
  RequestListItemComponent,
  ReturnRequestDeliveryStatusBadgeComponent,
  ReturnRequestViewItemComponent,
  ReturnRequestOrderItemComponent,
  ReturnRequestItemListComponent,
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
  ScrollPanelModule,
  MultiSelectModule,
  TagModule,
  ProgressSpinnerModule,
  CalendarModule,
  InputSwitchModule,
  ChartModule,
  InputNumberModule,
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
    InfiniteScrollModule,
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
