import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { Subject, debounceTime, takeUntil } from 'rxjs';

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { TransactionStatus } from '@shared/enums/transaction-status.enum';
import { TransactionSyncOneCStatus } from '@shared/enums/transaction-sync-one-c-status.enum';
import { PaymentTransaction } from '@shared/interfaces/entities/payment-transaction.entity';
import { PageOptions } from '@shared/interfaces/page-options.interface';
import { Page } from '@shared/interfaces/page.interface';
import { UserService } from '@shared/services/user.service';

@Component({
  selector: 'app-transactions-list',
  templateUrl: './transactions-list.component.html',
  styleUrls: ['./transactions-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsListComponent implements OnDestroy {
  @Input() set paymentTransactions(
    paymentTransactions: Page<PaymentTransaction> | null,
  ) {
    this.paymentTransactionsInternal = paymentTransactions;
    if (paymentTransactions) {
      this.loading = false;
    }
  }
  @ViewChild('transactionsTable') transactionsTable!: Table;
  @Output() onLoadData = new EventEmitter<PageOptions>();

  transactions: PaymentTransaction[] = [];
  searchForm = this.fb.group({
    search: [''],
  });
  transactionStatus = TransactionStatus;
  transactionSyncOneCStatus = TransactionSyncOneCStatus;
  loading = true;
  currentUser = this.userService.getUser();
  rows = 20;

  get paymentTransactions(): Page<PaymentTransaction> | null {
    return this.paymentTransactionsInternal;
  }

  private paymentTransactionsInternal: Page<PaymentTransaction> | null = null;
  private destroy$ = new Subject();

  get searchControl() {
    return this.searchForm.get('search');
  }

  constructor(
    private fb: FormBuilder,
    private readonly router: Router,
    private readonly userService: UserService,
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

  navigateToEntity(transaction: PaymentTransaction) {
    // TODO: create URL builder service and move this logic there
    const path = this.currentUser?.isAnyAdmin ? '/admin' : '/dashboard';
    let entityPath: any[] = [];
    if (transaction.order) {
      entityPath = ['orders', transaction.order.number];
    } else if (transaction.orderReturnRequest) {
      entityPath = [
        'requests',
        'return-requests',
        transaction.orderReturnRequest.request?.number,
      ];
    } else if (transaction.fundsWithdrawalRequest) {
      entityPath = [
        'requests',
        'funds-withdrawal-requests',
        transaction.fundsWithdrawalRequest.request?.number,
      ];
    }

    this.router.navigate([path, ...entityPath]);
  }

  onLazyLoad(event: LazyLoadEvent) {
    this.loading = true;
    if (this.paymentTransactions) {
      this.paymentTransactions.data = [];
    }
    this.onLoadData.emit(new PageOptions(event));
  }
}
