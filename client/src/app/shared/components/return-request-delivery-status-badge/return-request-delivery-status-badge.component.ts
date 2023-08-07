import { Component, Input } from '@angular/core';

import { ReturnRequestDeliveryStatus } from '@shared/enums/return-request-delivery-status.enum';

@Component({
  selector: 'app-return-request-delivery-status-badge',
  templateUrl: './return-request-delivery-status-badge.component.html',
  styleUrls: ['./return-request-delivery-status-badge.component.scss'],
  host: {
    class: 'inline-flex',
  },
})
export class ReturnRequestDeliveryStatusBadgeComponent {
  @Input() status!: ReturnRequestDeliveryStatus;

  get style() {
    switch (this.status) {
      case ReturnRequestDeliveryStatus.Unspecified:
        return 'default';
      case ReturnRequestDeliveryStatus.Pending:
        return 'default';
      case ReturnRequestDeliveryStatus.Accepted:
        return 'accent';
      case ReturnRequestDeliveryStatus.InTransit:
        return 'accent';
      case ReturnRequestDeliveryStatus.Arrived:
        return 'warn';
      case ReturnRequestDeliveryStatus.Received:
        return 'success';
      case ReturnRequestDeliveryStatus.Declined:
        return 'danger';
      case ReturnRequestDeliveryStatus.Returned:
        return 'danger';
      default:
        return 'default';
    }
  }

  get text() {
    switch (this.status) {
      case ReturnRequestDeliveryStatus.Unspecified:
        return 'Уточнюється';
      case ReturnRequestDeliveryStatus.Pending:
        return 'В очікуванні';
      case ReturnRequestDeliveryStatus.Accepted:
        return 'Отримано службою доставки';
      case ReturnRequestDeliveryStatus.InTransit:
        return 'В дорозі';
      case ReturnRequestDeliveryStatus.Arrived:
        return 'Прибув у відділення';
      case ReturnRequestDeliveryStatus.Received:
        return 'Отримано';
      case ReturnRequestDeliveryStatus.Declined:
        return 'Скасовано';
      case ReturnRequestDeliveryStatus.Returned:
        return 'Повернуто';
      default:
        return 'Уточнюється';
    }
  }
}
