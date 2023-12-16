import { TransactionStatus } from '@enums/transaction-status.enum';

export function transactionStatusToLocaleString(
  status: TransactionStatus | undefined,
): string {
  switch (status) {
    case TransactionStatus.Pending:
      return 'В обробці';
    case TransactionStatus.Success:
      return 'Успішно';
    case TransactionStatus.Failed:
      return 'Помилка';
    default:
      return 'Невідомо';
  }
}
