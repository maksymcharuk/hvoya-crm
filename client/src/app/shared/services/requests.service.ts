import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '@environment/environment';

import { OrderReturnRequest } from '@shared/interfaces/entities/order-return-request.entity';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {
  constructor(private http: HttpClient) { }

  getOrderReturnRequests(): Observable<OrderReturnRequest[]> {
    return this.http
      .get<OrderReturnRequest[]>(`${environment.apiUrl}/return-request`)
      .pipe(map((requests) => requests.map((request) => new OrderReturnRequest(request))));
  }
}
