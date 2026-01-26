import Decimal from 'decimal.js';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import config from '@root/config';

import { BalanceEntity } from '@entities/balance.entity';
import { OrderEntity } from '@entities/order.entity';
import { PaymentTransactionEntity } from '@entities/payment-transaction.entity';
import { UserEntity } from '@entities/user.entity';
import { TransactionStatus } from '@enums/transaction-status.enum';
import { TransactionSyncOneCStatus } from '@enums/transaction-sync-one-c-status.enum';
import { sanitizeEntity } from '@utils/serialize-entity.util';

import { CaslAbilityFactory } from '@modules/casl/casl-ability/casl-ability.factory';
import { OneCApiClientService } from '@modules/integrations/one-c/one-c-client/services/one-c-api-client/one-c-api-client.service';

const { isDevelopment } = config();

@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(BalanceEntity)
    private balanceRepository: Repository<BalanceEntity>,
    private readonly dataSource: DataSource,
    private readonly oneCService: OneCApiClientService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async getByUserId(currentUserId: string): Promise<BalanceEntity> {
    const user = await this.dataSource.manager.findOne(UserEntity, {
      where: { id: currentUserId },
    });

    if (!user) {
      throw new HttpException('Користувач не знайдений.', 400);
    }

    const balance = await this.balanceRepository.findOneOrFail({
      where: { owner: { id: currentUserId } },
      relations: ['owner'],
    });

    const ability = this.caslAbilityFactory.createForUser(user);

    return sanitizeEntity(ability, balance);
  }

  async update(
    userId: string,
    amount: Decimal,
    manager: EntityManager,
    orderId?: string,
  ): Promise<BalanceEntity> {
    let balance = await manager.findOneOrFail(BalanceEntity, {
      where: { owner: { id: userId } },
    });

    const paymentTransactions = await manager.find(PaymentTransactionEntity, {
      where: { balance: { id: balance.id } },
      order: {
        createdAt: 'DESC',
      },
    });

    const paymentTransaction = await manager.create(PaymentTransactionEntity, {
      amount,
      netBalance: balance.amount.plus(amount),
    });

    if (orderId) {
      paymentTransaction.order = { id: orderId } as OrderEntity;
    }

    await manager.save(PaymentTransactionEntity, paymentTransaction);

    if (amount.isNegative() && balance.amount.lessThan(amount.neg())) {
      throw new HttpException('Недостатньо коштів на балансі.', 400);
    }

    await manager.save(BalanceEntity, {
      id: balance.id,
      amount: balance.amount.plus(amount),
      paymentTransactions: [...paymentTransactions, paymentTransaction],
    });

    // TODO: investigate why last transaction is missing in the balance
    // in case of order cretion, but it is present during addign funds operation
    return this.getByUserId(userId);
  }

  // Temporary "testing" solution
  // TODO: remove this method
  async addFunds(userId: string, amount: number): Promise<BalanceEntity> {
    if (!isDevelopment()) {
      throw new HttpException('Можливо тільки в режимі розробки.', 400);
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const balance = await this.update(
        userId,
        new Decimal(amount),
        queryRunner.manager,
      );

      // Find last created transaction where balance is equal to the current balance
      let transaction = await queryRunner.manager.findOneOrFail(
        PaymentTransactionEntity,
        {
          where: { balance: { id: balance.id } },
          order: {
            createdAt: 'DESC',
          },
        },
      );

      if (!transaction) {
        throw new HttpException('Транзакція не знайдена.', 400);
      }

      transaction = await queryRunner.manager.save(PaymentTransactionEntity, {
        id: transaction.id,
        status: TransactionStatus.Success,
        syncOneCStatus: TransactionSyncOneCStatus.Success,
      });

      await this.oneCService.depositFunds({
        userId,
        amount,
        createdAt: transaction.updatedAt,
      });

      await queryRunner.commitTransaction();
      return this.getByUserId(userId);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async fulfillTransaction(transactionId: string) {
    console.log(
      '[BalanceService] fulfillTransaction() called with transactionId:',
      transactionId,
    );
    const queryRunner = this.dataSource.createQueryRunner();
    const manager = queryRunner.manager;

    await queryRunner.connect();
    console.log(
      '[BalanceService] fulfillTransaction() - QueryRunner connected',
    );
    await queryRunner.startTransaction();
    console.log('[BalanceService] fulfillTransaction() - Transaction started');
    try {
      console.log(
        '[BalanceService] fulfillTransaction() - Searching for payment transaction with id:',
        transactionId,
      );
      const transaction = await manager.findOneOrFail(
        PaymentTransactionEntity,
        {
          where: { id: transactionId },
          relations: ['balance', 'balance.owner'],
        },
      );
      console.log(
        '[BalanceService] fulfillTransaction() - Payment transaction found:',
        {
          id: transaction.id,
          amount: transaction.amount,
          currentBalance: transaction.balance.amount,
          userId: transaction.balance.owner.id,
        },
      );

      console.log(
        '[BalanceService] fulfillTransaction() - Updating balance from',
        transaction.balance.amount,
        'to',
        transaction.balance.amount.plus(transaction.amount),
      );
      await manager.save(BalanceEntity, {
        id: transaction.balance.id,
        amount: transaction.balance.amount.plus(transaction.amount),
      });
      console.log(
        '[BalanceService] fulfillTransaction() - Balance updated successfully',
      );

      console.log(
        '[BalanceService] fulfillTransaction() - Updating transaction status to Success',
      );
      await manager.save(PaymentTransactionEntity, {
        id: transaction.id,
        status: TransactionStatus.Success,
        syncOneCStatus: TransactionSyncOneCStatus.Success,
      });
      console.log(
        '[BalanceService] fulfillTransaction() - Transaction status updated successfully',
      );

      console.log(
        '[BalanceService] fulfillTransaction() - Calling oneCService.depositFunds()',
      );
      try {
        await this.oneCService.depositFunds({
          userId: transaction.balance.owner.id,
          amount: transaction.amount.toNumber(),
          createdAt: transaction.createdAt,
        });
        console.log(
          '[BalanceService] fulfillTransaction() - oneCService.depositFunds() completed successfully',
        );
      } catch (oneCErr) {
        console.error(
          '[BalanceService] fulfillTransaction() - oneCService.depositFunds() failed:',
          oneCErr instanceof Error ? oneCErr.message : String(oneCErr),
        );
        console.error(
          '[BalanceService] fulfillTransaction() - Full error details:',
          oneCErr,
        );
        throw oneCErr;
      }

      await queryRunner.commitTransaction();
      console.log(
        '[BalanceService] fulfillTransaction() - Transaction committed successfully',
      );
    } catch (error) {
      console.error(
        '[BalanceService] fulfillTransaction() - Error occurred:',
        error instanceof Error ? error.message : String(error),
      );
      console.error(
        '[BalanceService] fulfillTransaction() - Full error details:',
        error,
      );
      console.log(
        '[BalanceService] fulfillTransaction() - Rolling back transaction',
      );
      try {
        await queryRunner.rollbackTransaction();
        console.log(
          '[BalanceService] fulfillTransaction() - Transaction rolled back successfully',
        );
      } catch (rollbackErr) {
        console.error(
          '[BalanceService] fulfillTransaction() - Rollback failed:',
          rollbackErr instanceof Error
            ? rollbackErr.message
            : String(rollbackErr),
        );
      }

      console.log(
        '[BalanceService] fulfillTransaction() - Updating transaction syncOneCStatus to Failed',
      );
      try {
        await this.dataSource.manager.save(PaymentTransactionEntity, {
          id: transactionId,
          syncOneCStatus: TransactionSyncOneCStatus.Failed,
        });
        console.log(
          '[BalanceService] fulfillTransaction() - Transaction status marked as Failed',
        );
      } catch (statusErr) {
        console.error(
          '[BalanceService] fulfillTransaction() - Failed to update transaction status:',
          statusErr instanceof Error ? statusErr.message : String(statusErr),
        );
      }

      console.error(
        '[BalanceService] fulfillTransaction() - Re-throwing error to caller',
      );
      throw error;
    } finally {
      await queryRunner.release();
      console.log(
        '[BalanceService] fulfillTransaction() - QueryRunner released',
      );
    }
  }

  async cancelTransactionBanking(
    manager: EntityManager,
    amount: number,
    bankTransactionId: string,
    paymentTransaction: PaymentTransactionEntity,
  ) {
    console.log('[BalanceService] cancelTransactionBanking() called with:', {
      amount,
      bankTransactionId,
      transactionId: paymentTransaction.id,
    });
    try {
      const result = await manager.save(PaymentTransactionEntity, {
        ...paymentTransaction,
        bankTransactionId,
        amount: new Decimal(amount),
        status: TransactionStatus.Cancelled,
      });
      console.log(
        '[BalanceService] cancelTransactionBanking() - Transaction cancelled successfully:',
        { id: result.id, status: result.status },
      );
      return result;
    } catch (err) {
      console.error(
        '[BalanceService] cancelTransactionBanking() - Error occurred:',
        err instanceof Error ? err.message : String(err),
      );
      console.error(
        '[BalanceService] cancelTransactionBanking() - Full error details:',
        err,
      );
      throw err;
    }
  }
}
