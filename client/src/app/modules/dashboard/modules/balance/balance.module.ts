import { SkeletonModule } from 'primeng/skeleton';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BalanceWidgetComponent } from './components/balance-widget/balance-widget.component';
import { TransactionHistoryComponent } from './pages/transaction-history/transaction-history.component';
import { BalanceRoutingModule } from './balance-routing.module';



@NgModule({
  declarations: [
    BalanceWidgetComponent,
    TransactionHistoryComponent,
  ],
  imports: [
    CommonModule,
    SkeletonModule,
    ButtonModule,
    RouterModule,
    TableModule,
    BalanceRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    TooltipModule,
  ],
  exports: [
    BalanceWidgetComponent,
  ]
})
export class BalanceModule { }
