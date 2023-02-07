import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { DashboardProductsRoutingModule } from './dashboard-products-routing.module';
import { DashboardProductsComponent } from './dashboard-products.component';
import { DashboardProductListComponent } from './pages/dashboard-product-list/dashboard-product-list.component';

@NgModule({
  declarations: [DashboardProductsComponent, DashboardProductListComponent],
  imports: [CommonModule, DashboardProductsRoutingModule, SharedModule],
})
export class DashboardProductsModule {}
