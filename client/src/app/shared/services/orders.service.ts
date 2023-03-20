import { Observable, map } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@environment/environment';
import { Order } from '@shared/interfaces/entities/order.entity';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  constructor(private http: HttpClient) {}

  orderCreate(orderCreateFormData: FormData): Observable<Order> {
    return this.http
      .post<Order>(`${environment.apiUrl}/orders`, orderCreateFormData)
      .pipe(map((order) => new Order(order)));
  }

  orderUpdate(id: number, updateOrderFormData: FormData): Observable<Order> {
    return this.http
      .put<Order>(`${environment.apiUrl}/orders/${id}`, updateOrderFormData)
      .pipe(map((order) => new Order(order)));
  }

  updateWaybill(
    id: number,
    updateWaybillFormData: FormData,
  ): Observable<Order> {
    return this.http
      .put<Order>(
        `${environment.apiUrl}/orders/${id}/update-waybill`,
        updateWaybillFormData,
      )
      .pipe(map((order) => new Order(order)));
  }

  getOrders(): Observable<Order[]> {
    return this.http
      .get<Order[]>(`${environment.apiUrl}/orders`)
      .pipe(map((orders) => orders.map((order) => new Order(order))));
  }

  getOrder(id: number): Observable<Order> {
    return this.http
      .get<Order>(`${environment.apiUrl}/orders/${id}`)
      .pipe(map((order) => new Order(order)));
  }
}
