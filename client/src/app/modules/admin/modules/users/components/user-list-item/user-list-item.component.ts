import { Component, Input } from '@angular/core';

import { NotificationEntity } from '@shared/interfaces/entities/notification.entity';
import { User } from '@shared/interfaces/entities/user.entity';
import { NotificationsService } from '@shared/services/notifications.service';

@Component({
  selector: 'tr[app-user-list-item]',
  templateUrl: './user-list-item.component.html',
  styleUrls: ['./user-list-item.component.scss'],
  host: {
    '(click)': 'checkUserNotification()',
  },
})
export class UserListItemComponent {
  notifications$ = this.notificationsService.notifications$;

  @Input() user!: User;
  @Input() userNotification: any;

  constructor(private readonly notificationsService: NotificationsService) {}

  showUserNotification(
    user: User,
    notificationList: NotificationEntity[] | null,
  ) {
    if (!notificationList) {
      return;
    }
    const notification = notificationList.find((notification) => {
      return notification.dataIsUser(notification.data)
        ? notification.data.id === user.id
        : false;
    });
    this.userNotification = notification;
    return notification ? !notification.checked : false;
  }

  checkUserNotification() {
    if (this.userNotification) {
      this.notificationsService.checkNotification(this.userNotification.id);
    }
  }
}
