import { Pipe, PipeTransform } from '@angular/core';

import { ICONS } from '@shared/constants/base.constants';
import { PaymentTransaction } from '@shared/interfaces/entities/payment-transaction.entity';

@Pipe({
  name: 'transactionIcon',
})
export class TransactionIconPipe implements PipeTransform {
  transform(transaction: PaymentTransaction): string {
    return `pi ${this.getIconClass(transaction)}`;
  }

  private getIconClass(transaction: PaymentTransaction): string {
    switch (true) {
      case !!transaction.order:
        return ICONS.ORDER;
      case !!transaction.orderReturnRequest:
        return ICONS.ORDER_RETURN_REQUEST;
      case !!transaction.fundsWithdrawalRequest:
        return ICONS.FUNDS_WITHDRAWAL_REQUEST;
      default:
        return ICONS.DEFAULT;
    }
  }
}
