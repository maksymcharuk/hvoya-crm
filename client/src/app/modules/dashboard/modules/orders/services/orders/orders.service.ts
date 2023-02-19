import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@environment/environment';
import { OrderCreateResponse } from '@shared/interfaces/responses/create-order.response';
import { GetOrderResponse } from '@shared/interfaces/responses/get-order.response';
import { GetOrdersResponse } from '@shared/interfaces/responses/get-orders.response';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  constructor(private http: HttpClient) {}

  orderCreate(orderCreateFormData: FormData): Observable<OrderCreateResponse> {
    return this.http.post<OrderCreateResponse>(
      `${environment.apiUrl}/orders`,
      orderCreateFormData,
    );
  }

  getOrders(): Observable<GetOrdersResponse> {
    return this.http.get<GetOrdersResponse>(`${environment.apiUrl}/orders`);
  }

  getOrder(id: number): Observable<GetOrderResponse> {
    return this.http.get<GetOrderResponse>(
      `${environment.apiUrl}/orders/${id}`,
    );
  }
}
