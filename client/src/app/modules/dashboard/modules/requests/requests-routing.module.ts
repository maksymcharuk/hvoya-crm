import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FundsWithdrawalRequestViewComponent } from './pages/funds-withdrawal-request-view/funds-withdrawal-request-view.component';
import { RequestCreateComponent } from './pages/request-create/request-create.component';
import { RequestListComponent } from './pages/request-list/request-list.component';
import { ReturnRequestViewComponent } from './pages/return-request-view/return-request-view.component';

const routes: Routes = [
  {
    path: '',
    component: RequestListComponent,
    title: 'Список запитів - Hvoya CRM',
  },
  {
    path: 'create',
    component: RequestCreateComponent,
    title: 'Створення запиту - Hvoya CRM',
  },
  {
    path: 'return-requests/:number',
    component: ReturnRequestViewComponent,
  },
  {
    path: 'funds-withdrawal-requests/:number',
    component: FundsWithdrawalRequestViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestsRoutingModule {}
