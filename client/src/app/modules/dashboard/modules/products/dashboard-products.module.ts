import { ButtonModule } from 'primeng/button';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { DashboardProductsRoutingModule } from './dashboard-products-routing.module';
import { DashboardProductsComponent } from './dashboard-products.component';
import { DashboardProductBaseListComponent } from './pages/dashboard-product-base-list/dashboard-product-base-list.component';
import { DashboardProductListComponent } from './pages/dashboard-product-list/dashboard-product-list.component';
import { ViewProductComponent } from './pages/view-product/view-product.component';

@NgModule({
  declarations: [
    DashboardProductsComponent,
    DashboardProductListComponent,
    DashboardProductBaseListComponent,
    ViewProductComponent,
  ],
  imports: [
    CommonModule,
    DashboardProductsRoutingModule,
    ButtonModule,
    SharedModule,
  ],
})
export class DashboardProductsModule {}
