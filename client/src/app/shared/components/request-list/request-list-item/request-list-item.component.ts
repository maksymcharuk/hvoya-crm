import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { RequestType } from '@shared/enums/request-type.enum';
import { NotificationEntity } from '@shared/interfaces/entities/notification.entity';
import { RequestEntity } from '@shared/interfaces/entities/request.entity';
import { NotificationsService } from '@shared/services/notifications.service';
import { UserService } from '@shared/services/user.service';

@Component({
  selector: 'tr[app-request-list-item]',
  templateUrl: './request-list-item.component.html',
  styleUrls: ['./request-list-item.component.scss'],
  host: {
    '(click)': 'navigateToRequest()',
  },
})
export class RequestListItemComponent {
  @Input() adminView: boolean = false;
  @Input() request!: RequestEntity;
  @Input() requestNotification: any;

  requestType = RequestType;

  notifications$ = this.notificationsService.notifications$;

  constructor(
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly notificationsService: NotificationsService,
  ) {}

  showRequestNotification(
    request: RequestEntity,
    notificationList: NotificationEntity[] | null,
  ) {
    if (!notificationList) {
      return;
    }
    const notification = notificationList.find((notification) => {
      return notification.dataIsRequest(notification.data)
        ? notification.data.number === request.number
        : false;
    });
    this.requestNotification = notification;
    return notification ? !notification.checked : false;
  }

  navigateToRequest() {
    // TODO: create URL builder service and move this logic there
    const path = this.userService.getUser()?.isAnyAdmin
      ? '/admin'
      : '/dashboard';

    switch (this.request.requestType) {
      case RequestType.Return:
        this.router.navigate([
          `${path}/requests/return-requests/${this.request.number}`,
        ]);
        if (this.requestNotification) {
          this.notificationsService.checkNotification(
            this.requestNotification.id,
          );
        }
        break;
      case RequestType.FundsWithdrawal:
        this.router.navigate([
          `${path}/requests/funds-withdrawal-requests/${this.request.number}`,
        ]);
        if (this.requestNotification) {
          this.notificationsService.checkNotification(
            this.requestNotification.id,
          );
        }
        break;
      default:
        break;
    }
  }
}
