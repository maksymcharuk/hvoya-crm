import { Observable, map } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@environment/environment';
import { Balance } from '@shared/interfaces/entities/balance.entity';

@Injectable({
  providedIn: 'root',
})
export class BalanceService {
  constructor(private http: HttpClient) {}

  getBalance(): Observable<Balance> {
    return this.http
      .get<Balance>(`${environment.apiUrl}/balance`)
      .pipe(map((balance) => new Balance(balance)));
  }

  // temporary function to add funds to the balance
  addFunds(): Observable<Balance> {
    return this.http
      .post<Balance>(`${environment.apiUrl}/balance/add`, { amount: 500 })
      .pipe(map((balance) => new Balance(balance)));
  }
}
