import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { DashboardMainComponent } from './pages/main/main.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'products',
  },
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        component: DashboardMainComponent,
      },
      {
        path: 'account',
        loadChildren: () =>
          import('./modules/account/account.module').then(
            (m) => m.AccountModule,
          ),
      },
      {
        path: 'products',
        loadChildren: () =>
          import('./modules/products/dashboard-products.module').then(
            (m) => m.DashboardProductsModule,
          ),
      },
      {
        path: 'cart',
        loadChildren: () =>
          import('./modules/cart/cart.module').then((m) => m.CartModule),
      },
      {
        path: 'orders',
        loadChildren: () =>
          import('./modules/orders/orders.module').then((m) => m.OrdersModule),
      },
      {
        path: 'faq',
        loadChildren: () =>
          import('./modules/faq/faq.module').then((m) => m.FaqModule),
      },
      {
        path: 'balance',
        loadChildren: () =>
          import('./modules/balance/balance.module').then(
            (m) => m.BalanceModule,
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
