import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { DeliveryStatus } from '@shared/enums/return-request-delivery-status.enum';

@Component({
  selector: 'app-return-request-delivery-status-badge',
  templateUrl: './return-request-delivery-status-badge.component.html',
  styleUrls: ['./return-request-delivery-status-badge.component.scss'],
  host: {
    class: 'inline-flex',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReturnRequestDeliveryStatusBadgeComponent {
  @Input() status!: DeliveryStatus;

  get style() {
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
        return 'default';
    }
  }

  get text() {
    switch (this.status) {
      case DeliveryStatus.Unspecified:
        return 'Уточнюється';
      case DeliveryStatus.Pending:
        return 'В очікуванні';
      case DeliveryStatus.Accepted:
        return 'Отримано службою доставки';
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
