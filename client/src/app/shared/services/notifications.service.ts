import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationEntity } from '@shared/interfaces/entities/notification.entity';
import { NotificationType } from '@shared/enums/notification-type.enum';

import { environment } from '@environment/environment';

import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class NotificationsService {

  notifications$ = new BehaviorSubject<NotificationEntity[]>([]);
  notificationsNumber$ = this.notifications$.pipe(map((notifications) => notifications.filter((notification) => !notification.checked).length));
  ordersNotificationsNumber$ = this.notifications$.pipe(map((notifications) => notifications.filter((notification) => !notification.checked && notification.type === NotificationType.Order).length));
  usersNotificationsNumber$ = this.notifications$.pipe(map((notifications) => notifications.filter((notification) => !notification.checked && notification.type === NotificationType.User).length));

  constructor(private readonly http: HttpClient) {
    this.getNotifications()
      .subscribe((notifications) => this.notifications$.next(notifications));
  }

  getNotifications() {
    return this.http
      .get<NotificationEntity[]>(`${environment.apiUrl}/notifications`)
      .pipe(map((notificationsList) => notificationsList.map((notification) => new NotificationEntity(notification))));
  }

  checkNotification(id: number) {
    const response = this.http
      .post<NotificationEntity[]>(`${environment.apiUrl}/notifications`, { id })
      .pipe(map((notificationsList) => notificationsList.map((notification) => new NotificationEntity(notification))));

    response.subscribe((notifications) => {
      this.notifications$.next(notifications);
    });

    return response;
  }
}
