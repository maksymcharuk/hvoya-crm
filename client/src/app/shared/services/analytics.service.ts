import { Observable, map } from 'rxjs';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@environment/environment';
import { OrderData } from '@shared/interfaces/analystics/order-data.interface';
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

  getOrderDataForAdmins(options?: {
    range?: [Date, Date] | null;
  }): Observable<OrderData> {
    let params = new HttpParams();

    if (options) {
      if (options.range) {
        params = params
          .set('range', options.range[0].toISOString())
          .append('range', options.range[1].toISOString());
      }
    }

    return this.http
      .get<OrderData>(`${environment.apiUrl}/analytics/admins/orders`, {
        params,
      })
      .pipe(
        map((response) => ({
          completedOrders: response.completedOrders.map(
            (order) => new Order(order),
          ),
          failedOrders: response.failedOrders.map((order) => new Order(order)),
        })),
      );
  }
}
