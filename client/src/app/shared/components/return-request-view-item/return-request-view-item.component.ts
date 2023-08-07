import { Component, Input } from '@angular/core';

import { OrderReturnRequestItemEntity } from '@shared/interfaces/entities/order-return-request.entity';

@Component({
  selector: 'app-return-request-view-item',
  templateUrl: './return-request-view-item.component.html',
  styleUrls: ['./return-request-view-item.component.scss']
})
export class ReturnRequestViewItemComponent {
  @Input() requestItem!: OrderReturnRequestItemEntity;
}
