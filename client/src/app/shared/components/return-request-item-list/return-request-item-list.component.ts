import { Component, Input, OnInit } from '@angular/core';

import {
  OrderReturnRequest,
  OrderReturnRequestItemEntity,
} from '@shared/interfaces/entities/order-return-request.entity';

@Component({
  selector: 'app-return-request-item-list',
  templateUrl: './return-request-item-list.component.html',
  styleUrls: ['./return-request-item-list.component.scss'],
})
export class ReturnRequestItemListComponent implements OnInit {
  @Input() orderReturnRequest!: OrderReturnRequest;

  itemPairs: {
    requestedItem: OrderReturnRequestItemEntity;
    approvedItem?: OrderReturnRequestItemEntity;
  }[] = [];

  ngOnInit(): void {
    this.itemPairs = this.orderReturnRequest.requestedItems.map(
      (requestedItem) => {
        const approvedItem = this.orderReturnRequest.approvedItems.find(
          (approvedItem) =>
            approvedItem.orderItem.id === requestedItem.orderItem.id,
        );

        return {
          requestedItem,
          approvedItem,
        };
      },
    );
  }
}
