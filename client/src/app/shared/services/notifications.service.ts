import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationEntity } from '@shared/interfaces/entities/notification.entity';

import { environment } from '@environment/environment';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(private readonly http: HttpClient) { }

  getNotifications() {
    return this.http
      .get<NotificationEntity[]>(`${environment.apiUrl}/notifications`)
      .pipe(map((notificationsList) => notificationsList.map((notification) => new NotificationEntity(notification))));
  }

  checkNotification(id: number) {
    return this.http
      .post<NotificationEntity[]>(`${environment.apiUrl}/notifications`, { id })
      .pipe(map((notificationsList) => notificationsList.map((notification) => new NotificationEntity(notification))));
  }
}
