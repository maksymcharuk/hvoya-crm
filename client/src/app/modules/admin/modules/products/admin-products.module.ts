import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@shared/shared.module';

import { AdminProductsRoutingModule } from './admin-products-routing.module';

import { AdminProductsComponent } from './admin-products.component';
import { AdminProductListComponent } from './pages/admin-product-list/admin-product-list.component';

@NgModule({
  declarations: [AdminProductsComponent, AdminProductListComponent],
  imports: [CommonModule, AdminProductsRoutingModule, SharedModule],
})
export class AdminProductsModule {}
