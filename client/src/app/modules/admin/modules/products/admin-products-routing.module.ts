import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminProductsComponent } from './admin-products.component';
import { AdminProductListComponent } from './pages/admin-product-list/admin-product-list.component';
import { CreateProductComponent } from './pages/create-product/create-product.component';
import { EditProductComponent } from './pages/edit-product/edit-product.component';
import { ViewProductComponent } from './pages/view-product/view-product.component';

const routes: Routes = [
  {
    path: '',
    component: AdminProductsComponent,
    children: [
      {
        path: '',
        component: AdminProductListComponent,
      },
      {
        path: 'create',
        component: CreateProductComponent,
      },
      {
        path: 'edit',
        component: EditProductComponent,
      },
      {
        path: ':baseId/:variantId',
        component: ViewProductComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminProductsRoutingModule {}
