import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { OrderStatus } from '@shared/enums/order-status.enum';

@Component({
  selector: 'app-order-status-badge',
  templateUrl: './order-status-badge.component.html',
  styleUrls: ['./order-status-badge.component.scss'],
  host: {
    class: 'inline-flex',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderStatusBadgeComponent {
  @Input() status!: OrderStatus;

  get style() {
    switch (this.status) {
      case OrderStatus.Pending:
        return 'success';
      case OrderStatus.Processing:
      case OrderStatus.TransferedToDelivery:
        return 'accent';
      case OrderStatus.Fulfilled:
        return 'default';
      case OrderStatus.Cancelled:
      case OrderStatus.Refused:
        return 'danger';
      case OrderStatus.Refunded:
        return 'warn';
      default:
        return 'success';
    }
  }

  get text() {
    switch (this.status) {
      case OrderStatus.Pending:
        return 'Нове';
      case OrderStatus.Processing:
        return 'Опрацьовується';
      case OrderStatus.TransferedToDelivery:
        return 'Відправлено';
      case OrderStatus.Fulfilled:
        return 'Виконано';
      case OrderStatus.Cancelled:
        return 'Скасовано';
      case OrderStatus.Refunded:
        return 'Повернуто';
      case OrderStatus.Refused:
        return 'Відмова';
      default:
        return 'Уточнюється';
    }
  }
}
