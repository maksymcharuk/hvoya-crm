import { BehaviorSubject } from 'rxjs';

import { Component } from '@angular/core';

import { PaymentTransaction } from '@shared/interfaces/entities/payment-transaction.entity';
import { PageOptions } from '@shared/interfaces/page-options.interface';
import { Page } from '@shared/interfaces/page.interface';
import { PaymentTransactionsService } from '@shared/services/payment-transactions.service';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.scss'],
})
export class TransactionHistoryComponent {
  paymentTransactions$ = new BehaviorSubject<Page<PaymentTransaction> | null>(
    null,
  );

  constructor(
    private readonly paymentTransactionsService: PaymentTransactionsService,
  ) {}

  onLoadPaymentTransactions(pageOptions: PageOptions) {
    this.paymentTransactionsService
      .getPaymentTransactions(pageOptions)
      .subscribe((paymentTransactions) =>
        this.paymentTransactions$.next(paymentTransactions),
      );
  }
}
