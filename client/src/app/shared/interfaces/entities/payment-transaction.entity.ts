import { TransactionStatus } from '@shared/enums/transaction-status.enum';
import { TransactionSyncOneCStatus } from '@shared/enums/transaction-sync-one-c-status.enum';

import { BaseEntity } from './base.entity';
import { FundsWithdrawalRequest } from './funds-withdrawal-request.entity';
import { OrderReturnRequest } from './order-return-request.entity';
import { Order } from './order.entity';

export class PaymentTransaction extends BaseEntity {
  amount: number;
  netBalance: number;
  order: Order | null;
  orderReturnRequest: OrderReturnRequest | null;
  fundsWithdrawalRequest: FundsWithdrawalRequest | null;
  status?: TransactionStatus;
  syncOneCStatus?: TransactionSyncOneCStatus;

  constructor(data?: PaymentTransaction) {
    super(data);
    this.amount = data?.amount || 0;
    this.netBalance = data?.netBalance || 0;
    this.order = data?.order ? new Order(data.order) : null;
    this.orderReturnRequest = data?.orderReturnRequest
      ? new OrderReturnRequest(data.orderReturnRequest)
      : null;
    this.fundsWithdrawalRequest = data?.fundsWithdrawalRequest
      ? new FundsWithdrawalRequest(data.fundsWithdrawalRequest)
      : null;
    this.status = data?.status || TransactionStatus.Pending;
    this.syncOneCStatus =
      data?.syncOneCStatus || TransactionSyncOneCStatus.Pending;
  }
}
