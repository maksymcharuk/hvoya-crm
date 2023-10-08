import { FundsWithdrawalRequestStatus } from '@shared/enums/funds-withdrawal-request-status.enum';

import { BaseEntity } from './base.entity';
import { File } from './file.entity';
import { PaymentTransaction } from './payment-transaction.entity';
import { RequestEntity } from './request.entity';

export class FundsWithdrawalRequest extends BaseEntity {
  amount: number;
  status: FundsWithdrawalRequestStatus;
  request: RequestEntity | null;
  paymentTransactions: PaymentTransaction[];
  fundsWithdrawalReceipt: File | null;

  constructor(data?: FundsWithdrawalRequest) {
    super(data);
    this.amount = data?.amount || 0;
    this.status = data?.status || FundsWithdrawalRequestStatus.Pending;
    this.request = data?.request ? new RequestEntity(data.request) : null;
    this.paymentTransactions =
      data?.paymentTransactions?.map(
        (paymentTransaction) => new PaymentTransaction(paymentTransaction),
      ) || [];
    this.fundsWithdrawalReceipt = data?.fundsWithdrawalReceipt
      ? new File(data.fundsWithdrawalReceipt)
      : null;
  }
}
