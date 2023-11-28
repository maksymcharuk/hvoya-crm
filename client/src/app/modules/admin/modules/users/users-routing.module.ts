import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserComponent } from './pages/user/user.component';
import { UsersListPageComponent } from './pages/users-list/users-list-page.component';

const routes: Routes = [
  {
    path: '',
    component: UsersListPageComponent,
    title: 'Список користувачів - Hvoya CRM',
  },
  {
    path: ':id',
    component: UserComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
