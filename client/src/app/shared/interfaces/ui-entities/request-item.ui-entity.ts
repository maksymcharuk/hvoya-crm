import { OrderItem } from '../entities/order.entity';

interface RequestItemUIEntityData {
  quantity: number;
  orderItem: OrderItem;
}

export class RequestItemUIEntity {
  quantity: number;
  orderItem: OrderItem;

  readonly orderItemId: string;

  constructor(requestItem: RequestItemUIEntityData) {
    this.quantity = requestItem.quantity;
    this.orderItem = requestItem.orderItem;

    this.orderItemId = requestItem.orderItem.id;
  }
}
