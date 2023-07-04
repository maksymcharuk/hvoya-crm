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
      relations: ['paymentTransactions.order', 'owner'],
      order: {
        paymentTransactions: {
          createdAt: 'DESC',
        },
      },
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

    const paymentTransaction = await manager.create(PaymentTransactionEntity, {
      amount,
    });

    if (orderId) {
      paymentTransaction.order = { id: orderId } as OrderEntity;
    }

    await manager.save(PaymentTransactionEntity, paymentTransaction);

    if (amount.isNegative()) {
      if (balance.amount.lessThan(amount.neg())) {
        throw new HttpException('Недостатньо коштів на балансі.', 400);
      }
      await manager.save(BalanceEntity, {
        id: balance.id,
        amount: balance.amount.minus(amount.neg()),
        paymentTransactions: [
          ...balance.paymentTransactions,
          paymentTransaction,
        ],
      });
    } else {
      await manager.save(BalanceEntity, {
        id: balance.id,
        amount: balance.amount.plus(amount),
        paymentTransactions: [
          ...balance.paymentTransactions,
          paymentTransaction,
        ],
      });
    }

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

  async addFundsBanking(
    manager: EntityManager,
    userId: string,
    amount: number,
    bankTransactionId: string,
    paymentTransaction: PaymentTransactionEntity,
  ) {
    const balance = await manager.findOneOrFail(BalanceEntity, {
      where: { owner: { id: userId } },
    });

    const transaction = await manager.save(PaymentTransactionEntity, {
      ...paymentTransaction,
      bankTransactionId,
      amount: new Decimal(amount),
      status: TransactionStatus.Success,
    });

    await manager.save(BalanceEntity, {
      id: balance.id,
      amount: balance.amount.plus(amount),
      paymentTransactions: [...balance.paymentTransactions, paymentTransaction],
    });

    await this.oneCService.depositFunds({
      userId,
      amount: amount,
      createdAt: transaction.updatedAt,
    });
  }

  async cancelTransactionBanking(
    manager: EntityManager,
    amount: number,
    bankTransactionId: string,
    paymentTransaction: PaymentTransactionEntity,
  ) {
    await manager.save(PaymentTransactionEntity, {
      ...paymentTransaction,
      bankTransactionId,
      amount: new Decimal(amount),
      status: TransactionStatus.Cancelled,
    });
  }
}
