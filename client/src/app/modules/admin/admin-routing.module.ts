import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminComponent } from './admin.component';
import { AdminDashboardComponent } from './pages/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'orders',
  },
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'main',
        component: AdminDashboardComponent,
        title: 'Головна - Hvoya CRM',
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
          import('./modules/products/admin-products.module').then(
            (m) => m.AdminProductsModule,
          ),
      },
      {
        path: 'orders',
        loadChildren: () =>
          import('./modules/orders/orders.module').then((m) => m.OrdersModule),
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./modules/users/users.module').then((m) => m.UsersModule),
      },
      {
        path: 'faq',
        loadChildren: () =>
          import('./modules/faq/faq.module').then((m) => m.FaqModule),
      },
      {
        path: 'requests',
        loadChildren: () =>
          import('./modules/requests/requests.module').then(
            (m) => m.RequestsModule,
          ),
      },
      {
        path: 'posts',
        loadChildren: () =>
          import('./modules/posts/posts.module').then((m) => m.PostsModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
