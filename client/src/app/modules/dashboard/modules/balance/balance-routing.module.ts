import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TransactionHistoryComponent } from './pages/transaction-history/transaction-history.component';

const routes: Routes = [
  {
    path: 'transaction-history',
    component: TransactionHistoryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BalanceRoutingModule { }
