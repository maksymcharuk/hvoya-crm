import { DataSource } from 'typeorm';

import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { PaymentTransactionEntity } from '@entities/payment-transaction.entity';
import { TransactionSyncOneCStatus } from '@enums/transaction-sync-one-c-status.enum';

import { BalanceService } from './balance.service';

@Injectable()
export class BalanceTasksService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly logger: Logger,
    private readonly balanceService: BalanceService,
  ) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  async syncTransactions() {
    const notSyncedTransactions = await this.dataSource.manager.find(
      PaymentTransactionEntity,
      {
        where: {
          syncOneCStatus: TransactionSyncOneCStatus.Failed,
        },
        relations: ['balance', 'balance.owner'],
      },
    );

    if (!notSyncedTransactions || !notSyncedTransactions.length) {
      return;
    }

    for (const transaction of notSyncedTransactions) {
      const queryRunner = this.dataSource.createQueryRunner();

      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        await this.balanceService.addFundsAndSyncOneC(
          queryRunner.manager,
          transaction.id,
          transaction.amount,
        );
        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();
        this.logger.error('Error while syncing transaction with 1C', {
          transaction: { id: transaction.id },
          error,
        });
      } finally {
        await queryRunner.release();
      }
    }
  }
}
