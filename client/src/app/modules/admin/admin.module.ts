import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ChartModule } from 'primeng/chart';
import { DropdownModule } from 'primeng/dropdown';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LayoutModule } from '@shared/layout/layout.module';
import { SharedModule } from '@shared/shared.module';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { DropshippersAnalyticsComponent } from './components/dropshippers-analytics/dropshippers-analytics.component';
import { OrdersFunnelChartComponent } from './components/orders-funnel-chart/orders-funnel-chart.component';
import { OrdersStatusChartComponent } from './components/orders-status-chart/orders-status-chart.component';
import { ProductsAnalyticsComponent } from './components/products-analytics/products-analytics.component';
import { TopProductsChartComponent } from './components/top-products-chart/top-products-chart.component';
import { UsersRatingComponent } from './components/users-rating/users-rating.component';
import { AdminDashboardComponent } from './pages/dashboard/dashboard.component';

@NgModule({
  declarations: [
    AdminComponent,
    AdminDashboardComponent,
    UsersRatingComponent,
    DropshippersAnalyticsComponent,
    OrdersFunnelChartComponent,
    OrdersStatusChartComponent,
    ProductsAnalyticsComponent,
    TopProductsChartComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    DropdownModule,
    CalendarModule,
    OverlayPanelModule,
    BadgeModule,
    LayoutModule,
    SharedModule,
    TableModule,
    SkeletonModule,
    ChartModule,
    TabViewModule,
  ],
})
export class AdminModule {}
