import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminProductsComponent } from './admin-products.component';
import { AdminProductBaseListComponent } from './pages/admin-product-base-list/admin-product-base-list.component';
import { AdminProductListComponent } from './pages/admin-product-list/admin-product-list.component';
import { CreateProductComponent } from './pages/create-product/create-product.component';
import { EditProductComponent } from './pages/edit-product/edit-product.component';
import { TransferComponent } from './pages/transfer/transfer.component';
import { ViewProductComponent } from './pages/view-product/view-product.component';

const routes: Routes = [
  {
    path: '',
    component: AdminProductsComponent,
    children: [
      {
        path: '',
        component: AdminProductBaseListComponent,
        title: 'Список товарів - Hvoya CRM',
      },
      {
        path: 'create',
        component: CreateProductComponent,
        title: 'Створення товару - Hvoya CRM',
      },
      {
        path: 'edit',
        component: EditProductComponent,
        title: 'Редагування товару - Hvoya CRM',
      },
      {
        path: 'attributes',
        loadChildren: () =>
          import('./modules/product-attributes/product-attributes.module').then(
            (m) => m.ProductAttributesModule,
          ),
      },
      {
        path: 'transfer',
        component: TransferComponent,
        title: 'Імпорт/експорт товарів - Hvoya CRM',
      },
      {
        path: ':baseId',
        component: AdminProductListComponent,
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
export class AdminProductsRoutingModule {}
