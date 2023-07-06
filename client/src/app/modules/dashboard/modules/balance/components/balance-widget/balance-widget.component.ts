import { Component } from '@angular/core';

import { environment } from '@environment/environment';
import { AccountService } from '@shared/services/account.service';

import { UserBalanceService } from '../../services/user-balance.service';

@Component({
  selector: 'app-balance-widget',
  templateUrl: './balance-widget.component.html',
  styleUrls: ['./balance-widget.component.scss'],
})
export class BalanceWidgetComponent {
  balance$ = this.userBalance.balance$;
  profile$ = this.accountService.profile$;
  topUpTooltipMessage =
    'Для поповнення рахунку потрібно вказати номер договору, який вказано на цьому сайті.';
  // TODO: create experiment flags service or something
  environment = environment;

  constructor(
    private userBalance: UserBalanceService,
    private accountService: AccountService,
  ) {}

  addFundsTest() {
    this.userBalance.addFunds();
  }

  redirectToBank() {
    window.open(environment.privatBankPaymentUrl, '_blank');
  }
}
