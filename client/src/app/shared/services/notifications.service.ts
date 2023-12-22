import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@environment/environment';
import {
  ORDER_NOTIFICATIONS,
  REQUEST_NOTIFICATION,
  USER_NOTIFICATION,
} from '@shared/constants/notification.constants';
import { NotificationEntity } from '@shared/interfaces/entities/notification.entity';
import { PageOptions } from '@shared/interfaces/page-options.interface';
import { Page } from '@shared/interfaces/page.interface';

@Injectable()
export class NotificationsService {
  notifications$ = new BehaviorSubject<NotificationEntity[]>([]);
  notificationsNumber$ = this.notifications$.pipe(
    map(
      (notifications) =>
        notifications.filter((notification) => !notification.checked).length,
    ),
  );
  ordersNotificationsNumber$ = this.notifications$.pipe(
    map(
      (notifications) =>
        notifications.filter(
          (notification) =>
            !notification.checked &&
            ORDER_NOTIFICATIONS.includes(notification.type),
        ).length,
    ),
  );
  usersNotificationsNumber$ = this.notifications$.pipe(
    map(
      (notifications) =>
        notifications.filter(
          (notification) =>
            !notification.checked &&
            USER_NOTIFICATION.includes(notification.type),
        ).length,
    ),
  );
  requestsNotificationsNumber$ = this.notifications$.pipe(
    map(
      (notifications) =>
        notifications.filter(
          (notification) =>
            !notification.checked &&
            REQUEST_NOTIFICATION.includes(notification.type),
        ).length,
    ),
  );

  constructor(private readonly http: HttpClient) {
    // TODO: revamp notifications
    this.getNotifications(new PageOptions({ rows: 0 })).subscribe(
      (notifications) => {
        this.notifications$.next(notifications.data);
      },
    );
  }

  getNotifications(pageOptions: PageOptions) {
    let params = new HttpParams({ fromObject: pageOptions.toParams() });

    return this.http
      .get<Page<NotificationEntity>>(`${environment.apiUrl}/notifications`, {
        params,
      })
      .pipe(
        map((page) => ({
          data: page.data.map(
            (notification) => new NotificationEntity(notification),
          ),
          meta: page.meta,
        })),
      );
  }

  checkNotification(id: string, pageOptions?: PageOptions) {
    if (!pageOptions) {
      pageOptions = new PageOptions({ rows: 0 });
    }

    let params = new HttpParams({ fromObject: pageOptions.toParams() });

    const response = this.http
      .post<Page<NotificationEntity>>(
        `${environment.apiUrl}/notifications`,
        {
          id,
        },
        { params },
      )
      .pipe(
        map((page) => ({
          data: page.data.map(
            (notification) => new NotificationEntity(notification),
          ),
          meta: page.meta,
        })),
      );

    response.subscribe((notifications) => {
      this.notifications$.next(notifications.data);
    });

    return response;
  }
}
