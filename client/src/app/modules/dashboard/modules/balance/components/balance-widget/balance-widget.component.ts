import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { UserBalanceService } from '../../services/user-balance.service';

@Component({
  selector: 'app-balance-widget',
  templateUrl: './balance-widget.component.html',
  styleUrls: ['./balance-widget.component.scss']
})
export class BalanceWidgetComponent {
  purchaseHistory$ = this.userBalance.purchaseHistory$;

  constructor(
    private userBalance: UserBalanceService,
    private router: Router,
  ) { }


  addFunds() {
    this.userBalance.addFunds();
  }

  navigateToHistory() {
    this.router.navigate(['/dashboard/purchase-history']);
  }
}
