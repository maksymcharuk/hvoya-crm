import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { BalanceService } from '@shared/services/balance.service';
import { UserService } from '@shared/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class UserBalanceService {

  balance$ = new BehaviorSubject<number>(0);
  purchaseHistory$ = new BehaviorSubject<any[]>([]);

  user

  constructor(
    private balanceService: BalanceService,
    private userService: UserService,
  ) {
    this.user = this.userService.getUser();

    if (this.user) {
      this.balanceService.getBalance(this.user.id).subscribe((res) => {
        this.balance$.next(res);
      })

      this.balanceService.getUserPurchaseHistory(this.user.id).subscribe((res) => {
        this.purchaseHistory$.next(res);
      })
    }
  }

  addFunds() {
    if (this.user) {
      this.balanceService.addFunds(this.user.id);
    }
  }
}
