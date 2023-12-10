import { PaymentTransactionEntity } from '@entities/payment-transaction.entity';

export function getTransactionTypeLocaleString(
  transaction: PaymentTransactionEntity,
): string {
  if (transaction.order && transaction.amount.isNegative()) {
    return `Замовлення (№ ${transaction.order.number})`;
  } else if (transaction.order && transaction.amount.isPositive()) {
    return `Скасування замовлення (№ ${transaction.order.number})`;
  } else if (transaction.orderReturnRequest) {
    return `Повернення (№ ${transaction.orderReturnRequest.request.number})`;
  } else if (transaction.fundsWithdrawalRequest) {
    return `Виведення коштів (№ ${transaction.fundsWithdrawalRequest.request.number})`;
  } else {
    return 'Поповнення';
  }
}
