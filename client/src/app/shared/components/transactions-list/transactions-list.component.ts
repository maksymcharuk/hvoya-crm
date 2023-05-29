import { Table } from 'primeng/table';
import { Subject, debounceTime, takeUntil } from 'rxjs';

import { Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { Role } from '@shared/enums/role.enum';
import { TransactionStatus } from '@shared/enums/transaction-status.enum';
import { Balance } from '@shared/interfaces/entities/balance.entity';
import { PaymentTransaction } from '@shared/interfaces/entities/payment-transaction.entity';
import { UserService } from '@shared/services/user.service';

@Component({
  selector: 'app-transactions-list',
  templateUrl: './transactions-list.component.html',
  styleUrls: ['./transactions-list.component.scss'],
})
export class TransactionsListComponent implements OnDestroy {
  @Input() set balance(balance: Balance | undefined) {
    if (!balance) {
      return;
    }
    this.balanceInternal = balance;
    this.loading = false;
  }
  @ViewChild('transactionsTable') transactionsTable!: Table;

  transactions: PaymentTransaction[] = [];
  globalFilterFields = ['amount', 'createdAt'];
  searchForm = this.fb.group({
    search: [''],
  });
  transactionStatus = TransactionStatus;
  loading = true;

  get balance(): Balance {
    return this.balanceInternal;
  }

  private balanceInternal!: Balance;
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

  navigateToOrder(orderNumber: number) {
    const role = this.userService.getUser()?.role;
    // TODO: create URL builder service and move this logic there
    const path =
      role === Role.Admin || role === Role.SuperAdmin ? '/admin' : '/dashboard';
    this.router.navigate([`${path}/orders/${orderNumber}`]);
  }
}