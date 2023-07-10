import { Pipe, PipeTransform } from '@angular/core';

import { TransactionStatus } from '@shared/enums/transaction-status.enum';

@Pipe({
  name: 'transactionSyncOneCStatus',
})
export class TransactionSyncOneCStatusPipe implements PipeTransform {
  transform(value: TransactionStatus | undefined): string {
    switch (value) {
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
}
