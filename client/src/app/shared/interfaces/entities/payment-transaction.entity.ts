import { TransactionStatus } from '@shared/enums/transaction-status.enum';
import { TransactionSyncOneCStatus } from '@shared/enums/transaction-sync-one-c-status.enum';

import { BaseEntity } from './base.entity';
import { Order } from './order.entity';

export class PaymentTransaction extends BaseEntity {
  amount: number;
  order?: Order;
  status?: TransactionStatus;
  syncOneCStatus?: TransactionSyncOneCStatus;

  constructor(data?: PaymentTransaction) {
    super(data);
    this.amount = data?.amount || 0;
    this.order = new Order(data?.order);
    this.status = data?.status || TransactionStatus.Pending;
    this.syncOneCStatus =
      data?.syncOneCStatus || TransactionSyncOneCStatus.Pending;
  }
}
