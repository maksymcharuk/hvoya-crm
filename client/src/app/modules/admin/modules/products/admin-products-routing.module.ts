import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminProductsComponent } from './admin-products.component';
import { AdminProductListComponent } from './pages/admin-product-list/admin-product-list.component';
import { CreateProductComponent } from './pages/create-product/create-product.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'products',
  },
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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminProductsRoutingModule { }
