import Decimal from 'decimal.js';
import { MigrationInterface, QueryRunner } from 'typeorm';

import { BalanceEntity } from '../../../entities/balance.entity';
import { PaymentTransactionEntity } from '../../../entities/payment-transaction.entity';
import { TransactionStatus } from '../../../enums/transaction-status.enum';

export class PopulateNetBalanceToExistingPaymentTransactionsPart21699831100771
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const balances = await queryRunner.manager.find(BalanceEntity);

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
        transaction.netBalance = accumulator.plus(transaction.amount);
        return transaction.netBalance;
      }, new Decimal(0));

      await queryRunner.manager.save(transactions);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const transactions = await queryRunner.manager.find(
      PaymentTransactionEntity,
    );

    for (let transaction of transactions) {
      transaction.netBalance = new Decimal(0);
    }

    await queryRunner.manager.save(transactions);
  }
}
