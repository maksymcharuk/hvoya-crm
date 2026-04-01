import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { DatePickerModule } from 'primeng/datepicker';
import { ChartModule } from 'primeng/chart';
import { SelectModule } from 'primeng/select';
import { PopoverModule } from 'primeng/popover';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LayoutModule } from '@shared/layout/layout.module';
import { SharedModule } from '@shared/shared.module';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { DropshippersAnalyticsComponent } from './components/dropshippers-analytics/dropshippers-analytics.component';
import { NlqChatComponent } from './components/nlq-chat/nlq-chat.component';
import { ProductsOverviewComponent } from './components/products-overview/products-overview.component';
import { OrdersFunnelChartComponent } from './components/orders-funnel-chart/orders-funnel-chart.component';
import { OrdersOverviewComponent } from './components/orders-overview/orders-overview.component';
import { OrdersStatusChartComponent } from './components/orders-status-chart/orders-status-chart.component';
import { ProductsAnalyticsComponent } from './components/products-analytics/products-analytics.component';
import { TopProductsChartComponent } from './components/top-products-chart/top-products-chart.component';
import { AdminDashboardComponent } from './pages/dashboard/dashboard.component';

@NgModule({
  declarations: [
    AdminComponent,
    AdminDashboardComponent,
    DropshippersAnalyticsComponent,
    OrdersFunnelChartComponent,
    OrdersOverviewComponent,
    OrdersStatusChartComponent,
    ProductsAnalyticsComponent,
    TopProductsChartComponent,
    NlqChatComponent,
    ProductsOverviewComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    SelectModule,
    DatePickerModule,
    PopoverModule,
    BadgeModule,
    LayoutModule,
    SharedModule,
    TableModule,
    SkeletonModule,
    ChartModule,
    TabsModule,
    TextareaModule,
    TooltipModule,
  ],
})
export class AdminModule {}
