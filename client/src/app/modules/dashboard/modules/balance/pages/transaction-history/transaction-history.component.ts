import { Table } from 'primeng/table';

import { Component, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { PaymentTransaction } from '@shared/interfaces/entities/payment-transaction.entity';
import { TransactionStatus } from '@shared/enums/transaction-status.enum';
import { UserBalanceService } from '../../services/user-balance.service';

import { debounceTime, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.scss']
})
export class TransactionHistoryComponent implements OnDestroy {
  balance$ = this.userBalance.balance$;
  transactions: PaymentTransaction[] = [];
  globalFilterFields = ['amount', 'createdAt']
  searchForm = this.fb.group({
    search: [''],
  });
  transactionStatus = TransactionStatus;
  private destroy$ = new Subject();

  @ViewChild('transactionsTable') transactionsTable!: Table;

  get searchControl() {
    return this.searchForm.get('search');
  }

  constructor(
    private fb: FormBuilder,
    private userBalance: UserBalanceService,
  ) {
    this.searchControl?.valueChanges
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe((query) => {
        this.transactionsTable.filterGlobal(query, 'contains');
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
