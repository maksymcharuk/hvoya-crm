import { Pipe, PipeTransform } from '@angular/core';
import { TransactionStatus } from '@shared/enums/transaction-status.enum';

@Pipe({
  name: 'transactionStatus'
})
export class TransactionStatusPipe implements PipeTransform {
  transform(value: TransactionStatus | undefined): string {
    switch (value) {
      case TransactionStatus.Pending:
        return 'В обробці';
      case TransactionStatus.Success:
        return 'Успішно';
      case TransactionStatus.Failed:
        return 'Невдало';
      case TransactionStatus.Cancelled:
        return 'Скасовано';
      default:
        return 'Невідомо';
    }
  }
}
