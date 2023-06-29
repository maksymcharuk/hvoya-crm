import { Component, Input } from '@angular/core';

import { OrderStatus } from '@shared/enums/order-status.enum';

@Component({
  selector: 'app-order-status-badge',
  templateUrl: './order-status-badge.component.html',
  styleUrls: ['./order-status-badge.component.scss'],
  host: {
    class: 'inline-flex',
  },
})
export class OrderStatusBadgeComponent {
  @Input() status!: OrderStatus;

  get style() {
    switch (this.status) {
      case OrderStatus.Pending:
        return 'default';
      case OrderStatus.Processing:
      case OrderStatus.TransferedToDelivery:
        return 'accent';
      case OrderStatus.Fulfilled:
        return 'success';
      case OrderStatus.Cancelled:
        return 'danger';
      case OrderStatus.Refunded:
        return 'warn';
      default:
        return 'default';
    }
  }

  get text() {
    switch (this.status) {
      case OrderStatus.Pending:
        return 'Нове';
      case OrderStatus.Processing:
        return 'Опрацьовується менеджером';
      case OrderStatus.TransferedToDelivery:
        return 'Передано до служби доставки';
      case OrderStatus.Fulfilled:
        return 'Виконано';
      case OrderStatus.Cancelled:
        return 'Скасовано';
      case OrderStatus.Refunded:
        return 'Повернуто';
      default:
        return 'Потребує уточнення';
    }
  }
}
