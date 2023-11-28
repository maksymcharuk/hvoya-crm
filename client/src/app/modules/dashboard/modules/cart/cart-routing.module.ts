import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CartComponent } from './pages/cart/cart.component';

const routes: Routes = [
  {
    path: '',
    component: CartComponent,
    title: 'Кошик - Hvoya CRM',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CartRoutingModule {}
