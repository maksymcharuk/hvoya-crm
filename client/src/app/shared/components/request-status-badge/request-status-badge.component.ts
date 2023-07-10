import { Component, Input } from '@angular/core';

import { OrderReturnRequestStatus } from '@shared/enums/order-return-request-status.enum';

@Component({
  selector: 'app-request-status-badge',
  templateUrl: './request-status-badge.component.html',
  styleUrls: ['./request-status-badge.component.scss']
})
export class RequestStatusBadgeComponent {
  @Input() status!: OrderReturnRequestStatus;

  get style() {
    switch (this.status) {
      case OrderReturnRequestStatus.Pending:
        return 'default';
      case OrderReturnRequestStatus.Approved:
        return 'success';
      case OrderReturnRequestStatus.Declined:
        return 'danger';
      default:
        return 'default';
    }
  }

  get text() {
    switch (this.status) {
      case OrderReturnRequestStatus.Pending:
        return 'Нове';
      case OrderReturnRequestStatus.Approved:
        return 'Підтверджено';
      case OrderReturnRequestStatus.Declined:
        return 'Відхилено';
      default:
        return 'Потребує уточнення';
    }
  }
}
