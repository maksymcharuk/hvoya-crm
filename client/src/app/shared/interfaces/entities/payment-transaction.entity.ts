import { PaymentTransactionStatus } from '@shared/enums/payment-transaction-status.enum';

import { BaseEntity } from './base.entity';

export class PaymentTransaction extends BaseEntity {
  amount: number;
  status: PaymentTransactionStatus;

  constructor(data?: PaymentTransaction) {
    super(data);
    this.amount = data?.amount || 0;
    this.status = data?.status || PaymentTransactionStatus.Pending;
  }
}
