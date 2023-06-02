import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Role } from '@shared/enums/role.enum';
import { NotificationEntity } from '@shared/interfaces/entities/notification.entity';
import { Order } from '@shared/interfaces/entities/order.entity';
import { NotificationsService } from '@shared/services/notifications.service';
import { UserService } from '@shared/services/user.service';

@Component({
  selector: 'tr[app-order-list-item]',
  templateUrl: './order-list-item.component.html',
  styleUrls: ['./order-list-item.component.scss'],
  host: {
    '(click)': "navigateToOrder()"
  }
})
export class OrderListItemComponent {

  notifications$ = this.notificationsService.notifications$;

  @Input() adminView: boolean = false;
  @Input() order!: Order;
  @Input() orderNotification: any;

  constructor(
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly notificationsService: NotificationsService,
  ) { }

  navigateToOrder() {
    const role = this.userService.getUser()?.role;
    // TODO: create URL builder service and move this logic there
    const path =
      role === Role.Admin || role === Role.SuperAdmin ? '/admin' : '/dashboard';
    this.router.navigate([`${path}/orders/${this.order.number}`]);

    if (this.orderNotification) {
      this.notificationsService.checkNotification(this.orderNotification.id);
    }
  }

  showOrderNotification(order: Order, notificationList: NotificationEntity[] | null) {
    if (!notificationList) {
      return;
    }
    const notification = notificationList.find((notification) => {
      return (notification.data as Order).number === order.number;
    });
    this.orderNotification = notification;
    return notification ? !notification.checked : false;
  }

  getPreviewThumbs(order: Order) {
    return order.items
      .map((item) => ({
        url: item.productProperties.images[0]?.url,
        alt: item.productProperties.name,
      }))
      .slice(0, 3);
  }

  getOrderItemsNumber(order: Order) {
    return order.items.reduce((acc, item) => acc + item.quantity, 0);
  }
}
