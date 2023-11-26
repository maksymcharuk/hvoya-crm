import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { DeliveryService } from '@shared/enums/delivery-service.enum';
import { DeliveryStatus } from '@shared/enums/delivery-status.enum';
import { NotificationEntity } from '@shared/interfaces/entities/notification.entity';
import { Order } from '@shared/interfaces/entities/order.entity';
import { NotificationsService } from '@shared/services/notifications.service';
import { UserService } from '@shared/services/user.service';

@Component({
  selector: 'tr[app-order-list-item]',
  templateUrl: './order-list-item.component.html',
  styleUrls: ['./order-list-item.component.scss'],
  host: {
    '(click)': 'navigateToOrder()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderListItemComponent {
  @Input() adminView: boolean = false;
  @Input() order!: Order;
  @Input() orderNotification: any;

  notifications$ = this.notificationsService.notifications$;

  constructor(
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly notificationsService: NotificationsService,
  ) {}

  deliveryWarningData = {
    danger: {
      text: ' Відправлення знаходиться у відділенні вже більше 7 днів. Може початися платне зберігання.',
      iconClass: 'danger',
      condition: (order: Order) => this.isDeliveryOverdue(order, 7),
    },
    warning: {
      text: 'Відправлення знаходиться у відділенні вже більше 5 днів',
      iconClass: 'warning',
      condition: (order: Order) => this.isDeliveryOverdue(order, 5),
    },
  };

  navigateToOrder() {
    // TODO: create URL builder service and move this logic there
    const path = this.userService.getUser()?.isAnyAdmin
      ? '/admin'
      : '/dashboard';

    const url = this.router.serializeUrl(
      this.router.createUrlTree([`${path}/orders/${this.order.number}`]),
    );
    window.open(url, '_blank');

    if (this.orderNotification) {
      this.notificationsService.checkNotification(this.orderNotification.id);
    }
  }

  showOrderNotification(
    order: Order,
    notificationList: NotificationEntity[] | null,
  ) {
    if (!notificationList) {
      return;
    }
    const notification = notificationList.find((notification) => {
      return notification.dataIsOrder(notification.data)
        ? notification.data.number === order.number
        : false;
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

  getDeliveryWarningData(order: Order) {
    return Object.values(this.deliveryWarningData).find((warning) => {
      return warning.condition(order);
    });
  }

  isDeliveryOverdue(order: Order, days: number) {
    return (
      order.delivery.deliveryService === DeliveryService.NovaPoshta &&
      order.delivery.status === DeliveryStatus.Arrived &&
      order.delivery.updatedAt <
        new Date(new Date().setDate(new Date().getDate() - days))
    );
  }
}
