import { Observable, map } from 'rxjs';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@environment/environment';
import { Order } from '@shared/interfaces/entities/order.entity';
import { PageOptions } from '@shared/interfaces/page-options.interface';
import { Page } from '@shared/interfaces/page.interface';

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

  orderUpdate(
    number: string,
    updateOrderFormData: FormData,
  ): Observable<Order> {
    return this.http
      .put<Order>(`${environment.apiUrl}/orders/${number}`, updateOrderFormData)
      .pipe(map((order) => new Order(order)));
  }

  updateByCustomer(
    number: string,
    updateWaybillFormData: FormData,
  ): Observable<Order> {
    return this.http
      .put<Order>(
        `${environment.apiUrl}/orders/${number}/update-by-customer`,
        updateWaybillFormData,
      )
      .pipe(map((order) => new Order(order)));
  }

  getOrders(pageOptions: PageOptions): Observable<Page<Order>> {
    let params = new HttpParams({ fromObject: pageOptions.toParams() });

    return this.http
      .get<Page<Order>>(`${environment.apiUrl}/orders`, {
        params,
      })
      .pipe(
        map((orders) => ({
          data: orders.data.map((order) => new Order(order)),
          meta: orders.meta,
        })),
      );
  }

  getOrdersForReturnRequest(): Observable<Order[]> {
    return this.http
      .get<Order[]>(`${environment.apiUrl}/orders/return-requests`)
      .pipe(map((orders) => orders.map((order) => new Order(order))));
  }

  getOrder(number: string): Observable<Order> {
    return this.http
      .get<Order>(`${environment.apiUrl}/orders/${number}`)
      .pipe(map((order) => new Order(order)));
  }

  cancelOrderByCustomer(number: string): Observable<Order> {
    return this.http
      .post<Order>(
        `${environment.apiUrl}/orders/${number}/cancel-by-customer`,
        {},
      )
      .pipe(map((order) => new Order(order)));
  }
}
