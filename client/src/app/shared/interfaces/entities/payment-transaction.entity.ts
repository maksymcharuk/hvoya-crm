import { BaseEntity } from './base.entity';
import { Order } from './order.entity';

export class PaymentTransaction extends BaseEntity {
  amount: number;
  order?: Order;

  constructor(data?: PaymentTransaction) {
    super(data);
    this.amount = data?.amount || 0;
    this.order = new Order(data?.order);
  }
}
