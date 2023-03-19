import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environment/environment';

import { Balance } from '@shared/interfaces/balance.interface';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BalanceService {

  constructor(private http: HttpClient) { }

  getBalance(): Observable<Balance> {
    return this.http.get<Balance>(`${environment.apiUrl}/balance`)
  }

  addFunds(userId: number) {
    console.log(userId, 'funds added');
  }
}
