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

  @Cron(CronExpression.EVERY_5_MINUTES)
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
      try {
        await this.balanceService.fulfillTransaction(transaction.id);
      } catch (error) {
        this.logger.error('Error while syncing transaction with 1C', {
          transaction: { id: transaction.id },
          error,
        });
      }
    }
  }
}
