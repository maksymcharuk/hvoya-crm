import { Component } from '@angular/core';

import { NotificationType } from '@shared/enums/notification-type.enum';
import { Role } from '@shared/enums/role.enum';
import { NotificationEntity } from '@shared/interfaces/entities/notification.entity';
import { NotificationsService } from '@shared/services/notifications.service';
import { UserService } from '@shared/services/user.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent {
  notifications$ = this.notificationsService.notifications$;
  notificationType = NotificationType;
  user = this.userService.getUser();

  constructor(
    private notificationsService: NotificationsService,
    private userService: UserService,
  ) {}

  checkNotification(notification: NotificationEntity) {
    if (!notification.checked) {
      this.notificationsService.checkNotification(notification.id);
    }
  }

  getPath(notification: NotificationEntity): string {
    if (!notification.data) {
      return '';
    }
    const root = [Role.Admin, Role.SuperAdmin].includes(this.user!.role)
      ? '/admin'
      : '/dashboard';
    if (notification.dataIsOrder(notification.data)) {
      return `${root}/orders/${notification.data.number}`;
    } else if (notification.dataIsUser(notification.data)) {
      return `${root}/users/${notification.data.id}`;
    } else {
      return '';
    }
  }
}
