import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { OrderReturnRequestItemEntity } from '@shared/interfaces/entities/order-return-request.entity';

@Component({
  selector: 'app-return-request-view-item',
  templateUrl: './return-request-view-item.component.html',
  styleUrls: ['./return-request-view-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReturnRequestViewItemComponent {
  @Input() requestedItem!: OrderReturnRequestItemEntity;
  @Input() approvedItem: OrderReturnRequestItemEntity | undefined;
}
