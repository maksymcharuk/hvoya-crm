import { Component } from '@angular/core';

import { UserBalanceService } from '../../services/user-balance.service';

@Component({
  selector: 'app-balance-widget',
  templateUrl: './balance-widget.component.html',
  styleUrls: ['./balance-widget.component.scss']
})
export class BalanceWidgetComponent {
  transactionsHistory$ = this.userBalance.transactionsHistory$;

  constructor(
    private userBalance: UserBalanceService,
  ) { }


  addFunds() {
    this.userBalance.addFunds();
  }
}
