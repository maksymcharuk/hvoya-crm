import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OrderCreateComponent } from './pages/order-create/order-create.component';
import { OrderListComponent } from './pages/order-list/order-list.component';
import { OrderViewComponent } from './pages/order-view/order-view.component';

const routes: Routes = [
  {
    path: '',
    component: OrderListComponent,
    title: 'Список замовлень - Hvoya CRM',
  },
  {
    path: 'checkout',
    component: OrderCreateComponent,
    title: 'Оформлення замовлення - Hvoya CRM',
  },
  {
    path: ':number',
    component: OrderViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdersRoutingModule {}
