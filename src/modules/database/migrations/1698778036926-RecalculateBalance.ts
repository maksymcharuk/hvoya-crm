import Decimal from 'decimal.js';
import { MigrationInterface, QueryRunner } from 'typeorm';

import { BalanceEntity } from '../../../entities/balance.entity';
import { PaymentTransactionEntity } from '../../../entities/payment-transaction.entity';
import { TransactionStatus } from '../../../enums/transaction-status.enum';

export class RecalculateBalance1698778036926 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const transactionsToRevertIds = [
      '993c7850-40ae-42ab-8f5d-7a339695c4b3',
      '1bd94f00-963e-489b-b9f4-4303af068303',
    ];

    // delete transactions
    await queryRunner.manager.delete(
      PaymentTransactionEntity,
      transactionsToRevertIds,
    );

    const balances = await queryRunner.manager
      .createQueryBuilder(BalanceEntity, 'balance')
      .leftJoin('balance.paymentTransactions', 'paymentTransactions')
      .addSelect([
        'balance.amount',
        'paymentTransactions.amount',
        'paymentTransactions.status',
      ])
      .getMany();

    // recalculating balance amount based on payment transactions
    for (let balance of balances) {
      const transactions = balance.paymentTransactions.filter(
        (transaction) => transaction.status === TransactionStatus.Success,
      );

      balance.amount = new Decimal(0);

      for (let transaction of transactions) {
        balance.amount = balance.amount.plus(transaction.amount);
      }

      await queryRunner.manager.save(balance);
    }
  }

  public async down(): Promise<void> {}
}
