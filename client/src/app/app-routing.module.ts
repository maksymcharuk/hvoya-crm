import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RoleGuard } from '@shared/guards/role/role.guard';
import { AdminPage } from '@shared/interfaces/pages/admin-page.entity';
import { DashboardPage } from '@shared/interfaces/pages/dashboard-page.entity';

import { SignedInGuard } from './shared/guards/signed-in/signed-in.guard';
import { SignedOutGuard } from './shared/guards/signed-out/signed-out.guard';

const routes: Routes = [
  { path: '', redirectTo: '/auth/sign-in', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
    canActivate: [SignedOutGuard],
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./modules/dashboard/dashboard.module').then(
        (m) => m.DashboardModule,
      ),
    canActivate: [SignedInGuard, RoleGuard],
    data: { policies: [DashboardPage] },
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./modules/admin/admin.module').then((m) => m.AdminModule),
    canActivate: [SignedInGuard, RoleGuard],
    data: { policies: [AdminPage] },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
