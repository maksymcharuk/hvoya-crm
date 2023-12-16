import Decimal from 'decimal.js';
import { MigrationInterface, QueryRunner } from 'typeorm';

import { BalanceEntity } from '../../../entities/balance.entity';
import { PaymentTransactionEntity } from '../../../entities/payment-transaction.entity';
import { TransactionStatus } from '../../../enums/transaction-status.enum';

export class RecalculateBalanceAndTransactionsNetBalance1702693018212
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const balances = await queryRunner.manager.find(BalanceEntity);

    // recalculating balance amount based on payment transactions
    for (let balance of balances) {
      const transactions = await queryRunner.manager.find(
        PaymentTransactionEntity,
        {
          where: {
            balance: { id: balance.id },
            status: TransactionStatus.Success,
          },
          order: {
            createdAt: 'ASC',
          },
        },
      );

      transactions.reduce((accumulator, transaction) => {
        const netBalance = accumulator.plus(transaction.amount);
        transaction.netBalance = netBalance;
        balance.amount = netBalance;
        return transaction.netBalance;
      }, new Decimal(0));

      await queryRunner.manager.save(balance);
      await queryRunner.manager.save(transactions);
    }
  }

  public async down(): Promise<void> {}
}
