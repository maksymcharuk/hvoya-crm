import { BehaviorSubject, combineLatest, of, switchMap, zip } from 'rxjs';

import { Component } from '@angular/core';

import { ICONS } from '@shared/constants/base.constants';
import { NotificationType } from '@shared/enums/notification-type.enum';
import { RequestType } from '@shared/enums/request-type.enum';
import { NotificationEntity } from '@shared/interfaces/entities/notification.entity';
import { NotificationsService } from '@shared/services/notifications.service';
import { UserService } from '@shared/services/user.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent {
  ICONS = ICONS;

  notifications$ = new BehaviorSubject<NotificationEntity[]>([]);
  scrolled$ = new BehaviorSubject<boolean>(false);
  notificationType = NotificationType;
  requestType = RequestType;
  user = this.userService.getUser();
  take = 10;
  skip = 0;

  constructor(
    private notificationsService: NotificationsService,
    private userService: UserService,
  ) {
    combineLatest([this.notificationsService.notifications$, this.scrolled$])
      .pipe(
        switchMap(([notifications, scrolled]) => {
          if (scrolled) {
            this.skip += this.take;
          }
          return zip([of(notifications), this.notifications$]);
        }),
      )
      .subscribe(([allNotifications, currentNotifications]) => {
        this.notifications$.next([
          ...currentNotifications,
          ...allNotifications.slice(this.skip, this.skip + this.take),
        ]);
      });
  }

  onScrolled() {
    this.scrolled$.next(true);
  }

  checkNotification(notification: NotificationEntity) {
    if (!notification.checked) {
      this.notificationsService.checkNotification(notification.id);
    }
  }

  getPath(notification: NotificationEntity): string {
    if (!notification.data) {
      return '';
    }
    // TODO: create URL builder service and move this logic there
    const root = this.user?.isAnyAdmin ? '/admin' : '/dashboard';
    if (notification.dataIsOrder(notification.data)) {
      return `${root}/orders/${notification.data.number}`;
    } else if (notification.dataIsUser(notification.data)) {
      return `${root}/users/${notification.data.id}`;
    } else if (notification.dataIsRequest(notification.data)) {
      if (notification.data.requestType === RequestType.Return) {
        return `${root}/requests/return-requests/${notification.data.number}`;
      } else if (
        notification.data.requestType === RequestType.FundsWithdrawal
      ) {
        return `${root}/requests/funds-withdrawal-requests/${notification.data.number}`;
      } else {
        return '';
      }
    } else {
      return '';
    }
  }
}
