import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardProductsComponent } from './dashboard-products.component';
import { DashboardProductListComponent } from './pages/dashboard-product-list/dashboard-product-list.component';
import { ViewProductComponent } from './pages/view-product/view-product.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'products',
  },
  {
    path: '',
    component: DashboardProductsComponent,
    children: [
      {
        path: '',
        component: DashboardProductListComponent,
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
export class DashboardProductsRoutingModule {}
