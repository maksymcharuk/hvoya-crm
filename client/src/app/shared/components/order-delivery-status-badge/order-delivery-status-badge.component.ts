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
      case OrderDeliveryStatus.Unspecified:
      case OrderDeliveryStatus.Pending:
        return 'success';
      case OrderDeliveryStatus.Accepted:
      case OrderDeliveryStatus.InTransit:
        return 'accent';
      case OrderDeliveryStatus.Arrived:
        return 'warn';
      case OrderDeliveryStatus.Received:
        return 'default';
      case OrderDeliveryStatus.Declined:
      case OrderDeliveryStatus.Returned:
        return 'danger';
      default:
        return 'success';
    }
  }

  get text() {
    switch (this.status) {
      case OrderDeliveryStatus.Unspecified:
        return 'Уточнюється';
      case OrderDeliveryStatus.Pending:
        return 'В очікуванні';
      case OrderDeliveryStatus.Accepted:
        return 'Прийнято';
      case OrderDeliveryStatus.InTransit:
        return 'В дорозі';
      case OrderDeliveryStatus.Arrived:
        return 'Прибув у відділення';
      case OrderDeliveryStatus.Received:
        return 'Отримано';
      case OrderDeliveryStatus.Declined:
        return 'Скасовано';
      case OrderDeliveryStatus.Returned:
        return 'Повернуто';
      default:
        return 'Уточнюється';
    }
  }
}
