import { Component, Input } from '@angular/core';

import { DeliveryStatus } from '@shared/enums/delivery-status.enum';

@Component({
  selector: 'app-order-delivery-status-badge',
  templateUrl: './order-delivery-status-badge.component.html',
  styleUrls: ['./order-delivery-status-badge.component.scss'],
  host: {
    class: 'inline-flex',
  },
})
export class OrderDeliveryStatusBadgeComponent {
  @Input() status!: DeliveryStatus;

  get style() {
    console.log(this.status);
    switch (this.status) {
      case DeliveryStatus.Unspecified:
      case DeliveryStatus.Pending:
        return 'success';
      case DeliveryStatus.Accepted:
      case DeliveryStatus.InTransit:
        return 'accent';
      case DeliveryStatus.Arrived:
        return 'warn';
      case DeliveryStatus.Received:
        return 'default';
      case DeliveryStatus.Declined:
      case DeliveryStatus.Returned:
        return 'danger';
      default:
        return 'success';
    }
  }

  get text() {
    switch (this.status) {
      case DeliveryStatus.Unspecified:
        return 'Уточнюється';
      case DeliveryStatus.Pending:
        return 'В очікуванні';
      case DeliveryStatus.Accepted:
        return 'Прийнято';
      case DeliveryStatus.InTransit:
        return 'В дорозі';
      case DeliveryStatus.Arrived:
        return 'Прибув у відділення';
      case DeliveryStatus.Received:
        return 'Отримано';
      case DeliveryStatus.Declined:
        return 'Скасовано';
      case DeliveryStatus.Returned:
        return 'Повернуто';
      default:
        return 'Уточнюється';
    }
  }
}
