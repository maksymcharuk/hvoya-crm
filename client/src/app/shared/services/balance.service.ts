import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BalanceService {

  constructor() { }

  getBalance(userId: number): Observable<number> {
    console.log(userId);
    return of(123);
  }

  getUserPurchaseHistory(userId: number): Observable<any[]> {
    console.log(userId);
    return of([
      { value: 123, info: 'info1', date: new Date() },
      { value: 324, info: 'info2', date: new Date() },
      { value: 4152, info: 'info3', date: new Date() },
      { value: 5511, info: 'info4', date: new Date() }
    ]);
  }

  addFunds(userId: number) {
    console.log(userId, 'funds added');
  }
}
