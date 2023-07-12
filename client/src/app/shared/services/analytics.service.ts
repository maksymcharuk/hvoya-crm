import { Observable, map } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@environment/environment';
import { Order } from '@shared/interfaces/entities/order.entity';
import { User } from '@shared/interfaces/entities/user.entity';
import { AdminAnalyticsResponse } from '@shared/interfaces/responses/admin-analytics.respose';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  constructor(private http: HttpClient) {}

  getAnalyticDataForAdmins(): Observable<AdminAnalyticsResponse> {
    return this.http
      .get<AdminAnalyticsResponse>(`${environment.apiUrl}/analytics/admins`)
      .pipe(
        map((response: AdminAnalyticsResponse) => ({
          usersData: response.usersData.map((userData) => ({
            user: new User(userData.user),
            ordersCount: userData.ordersCount,
            ordersTotal: userData.ordersTotal,
            maxOrder: new Order(userData.maxOrder),
            netWorth: userData.netWorth,
          })),
          ordersData: response.ordersData.map(
            (orderData) => new Order(orderData),
          ),
        })),
      );
  }
}
