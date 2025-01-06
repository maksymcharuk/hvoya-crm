import { Observable, map } from 'rxjs';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@environment/environment';
import { UserData } from '@shared/interfaces/analystics/user-data.interface';
import { Order } from '@shared/interfaces/entities/order.entity';
import { PageOptions } from '@shared/interfaces/page-options.interface';
import { Page } from '@shared/interfaces/page.interface';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  constructor(private http: HttpClient) {}

  getUserDataForAdmins(options: PageOptions): Observable<Page<UserData>> {
    const params = new HttpParams({ fromObject: options.toParams() });

    return this.http
      .get<Page<UserData>>(`${environment.apiUrl}/analytics/admins/users`, {
        params,
      })
      .pipe(
        map((response) => ({
          data: response.data,
          meta: response.meta,
        })),
      );
  }

  getOrders(): Observable<Order[]> {
    return this.http
      .get<Order[]>(`${environment.apiUrl}/analytics/admins/orders`)
      .pipe(map((orders) => orders.map((orderData) => new Order(orderData))));
  }
}
