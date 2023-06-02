import { BaseEntity } from './base.entity';
import { PaymentTransaction } from './payment-transaction.entity';

export class Balance extends BaseEntity {
  amount: number;
  paymentTransactions: PaymentTransaction[];

  constructor(data?: Balance) {
    super(data);
    this.amount = data?.amount || 0;
    this.paymentTransactions =
      data?.paymentTransactions?.map(
        (transaction) => new PaymentTransaction(transaction),
      ) || [];
  }
}
