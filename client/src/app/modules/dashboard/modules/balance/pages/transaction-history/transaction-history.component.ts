import { Component } from '@angular/core';

import { UserBalanceService } from '../../services/user-balance.service';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.scss'],
})
export class TransactionHistoryComponent {
  balance$ = this.userBalance.balance$;

  constructor(private userBalance: UserBalanceService) {}
}
