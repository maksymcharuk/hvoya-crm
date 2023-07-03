import { BehaviorSubject, Observable, share } from 'rxjs';

import { Injectable } from '@angular/core';

import { Balance } from '@shared/interfaces/entities/balance.entity';
import { TokenUser } from '@shared/interfaces/entities/token-user.entity';
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
    if (!this.user) {
      return new Observable<Balance>();
    }

    const request$ = this.balanceService.getBalance().pipe(share());
    request$.subscribe((res) => {
      this.balance$.next(res);
    });
    return request$;
  }

  addFunds() {
    if (this.user) {
      this.balanceService.addFunds().subscribe((res) => {
        this.balance$.next(res);
      });
    }
  }
}
