import { BehaviorSubject } from 'rxjs';

import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { environment } from '@environment/environment';
import { PaymentTransaction } from '@shared/interfaces/entities/payment-transaction.entity';
import { PageOptions } from '@shared/interfaces/page-options.interface';
import { AccountService } from '@shared/services/account.service';
import { UserService } from '@shared/services/user.service';

import { UserBalanceService } from '../../services/user-balance.service';

@Component({
  selector: 'app-balance-widget',
  templateUrl: './balance-widget.component.html',
  styleUrls: ['./balance-widget.component.scss'],
})
export class BalanceWidgetComponent {
  balance$ = this.userBalance.balance$;
  paymentTransactions$ = new BehaviorSubject<PaymentTransaction[]>([]);
  transactionsLoading = true;
  profile$ = this.accountService.profile$;
  topUpTooltipMessage =
    'Для поповнення рахунку потрібно вказати номер договору, який вказано на цьому сайті.';
  // TODO: create experiment flags service or something
  environment = environment;
  currentUser = this.userService.getUser();

  constructor(
    private userBalance: UserBalanceService,
    private accountService: AccountService,
    private readonly router: Router,
    private readonly userService: UserService,
  ) {
    if (this.currentUser) {
      this.userService
        .getUserPaymentTransactions(
          this.currentUser.id,
          new PageOptions({ rows: 3 }),
        )
        .subscribe((transactions) => {
          this.paymentTransactions$.next(transactions.data);
          this.transactionsLoading = false;
        });
    }
  }

  addFundsTest() {
    this.userBalance.addFunds();
  }

  redirectToBank() {
    window.open(environment.privatBankPaymentUrl, '_blank');
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
    }

    this.router.navigate([path, ...entityPath]);
  }
}
