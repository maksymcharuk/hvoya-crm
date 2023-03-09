import { Component, Input } from '@angular/core';

import { OrderDeliveryStatus } from '@shared/enums/order-delivery-status.enum';

@Component({
  selector: 'app-order-delivery-status-badge',
  templateUrl: './order-delivery-status-badge.component.html',
  styleUrls: ['./order-delivery-status-badge.component.scss'],
  host: {
    class: 'inline-flex',
  },
})
export class OrderDeliveryStatusBadgeComponent {
  @Input() status!: OrderDeliveryStatus;

  get style() {
    switch (this.status) {
      case OrderDeliveryStatus.Pending:
        return 'default';
      case OrderDeliveryStatus.Processing:
        return 'accent';
      case OrderDeliveryStatus.Accepted:
        return 'warn';
      case OrderDeliveryStatus.Sent:
        return 'warn';
      case OrderDeliveryStatus.Received:
        return 'success';
      case OrderDeliveryStatus.Declined:
        return 'danger';
      case OrderDeliveryStatus.Returned:
        return 'danger';
      default:
        return 'default';
    }
  }

  get text() {
    switch (this.status) {
      case OrderDeliveryStatus.Pending:
        return 'В очікуванні';
      case OrderDeliveryStatus.Processing:
        return 'Опрацьовується';
      case OrderDeliveryStatus.Sent:
        return 'Відправлено';
      case OrderDeliveryStatus.Accepted:
        return 'Прийнято';
      case OrderDeliveryStatus.Received:
        return 'Отримано';
      case OrderDeliveryStatus.Declined:
        return 'Скасовано';
      case OrderDeliveryStatus.Returned:
        return 'Повернуто';
      default:
        return 'В очікуванні';
    }
  }
}
