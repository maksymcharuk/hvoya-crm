import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardProductsComponent } from './dashboard-products.component';
import { DashboardProductBaseListComponent } from './pages/dashboard-product-base-list/dashboard-product-base-list.component';
import { DashboardProductListComponent } from './pages/dashboard-product-list/dashboard-product-list.component';
import { ViewProductComponent } from './pages/view-product/view-product.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardProductsComponent,
    children: [
      {
        path: '',
        component: DashboardProductBaseListComponent,
        title: 'Список товарів - Hvoya CRM',
      },
      {
        path: ':baseId',
        component: DashboardProductListComponent,
        title: 'Список товарів - Hvoya CRM',
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
