import { Component } from '@angular/core';

import { environment } from '@environment/environment';

import { UserBalanceService } from '../../services/user-balance.service';

@Component({
  selector: 'app-balance-widget',
  templateUrl: './balance-widget.component.html',
  styleUrls: ['./balance-widget.component.scss']
})
export class BalanceWidgetComponent {
  balance$ = this.userBalance.balance$;
  topUpTooltipMessage = 'Номер договору для поповнення рахунку вказаний на сторінці аккаунту.'

  constructor(
    private userBalance: UserBalanceService
  ) { }

  addFundsTest() {
    this.userBalance.addFunds();
  }

  redirectToBank() {
    window.open(environment.privatBankPaymentUrl, '_blank');
  }
}
