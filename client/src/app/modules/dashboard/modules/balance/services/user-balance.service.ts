import { BehaviorSubject } from 'rxjs';

import { Injectable } from '@angular/core';

import { Balance } from '@shared/interfaces/entities/balance.entity';
import { TokenUser } from '@shared/interfaces/token-user.interface';
import { BalanceService } from '@shared/services/balance.service';
import { UserService } from '@shared/services/user.service';

@Injectable()
export class UserBalanceService {
  balance$ = new BehaviorSubject<Balance | null>(null);
  user!: TokenUser | null;

  constructor(
    private balanceService: BalanceService,
    private userService: UserService,
  ) {
    this.user = this.userService.getUser();
    this.getUserBalance();
  }

  getUserBalance() {
    if (this.user) {
      this.balanceService.getBalance().subscribe((res) => {
        this.balance$.next(res);
      });
    }
  }

  addFunds() {
    if (this.user) {
      this.balanceService.addFunds().subscribe((res) => {
        this.balance$.next(res);
      });
    }
  }
}
