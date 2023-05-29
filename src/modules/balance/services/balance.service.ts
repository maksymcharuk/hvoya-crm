import Decimal from 'decimal.js';
import { EntityManager, Repository } from 'typeorm';

import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BalanceEntity } from '@entities/balance.entity';
import { OrderEntity } from '@entities/order.entity';
import { PaymentTransactionEntity } from '@entities/payment-transaction.entity';
import { TransactionStatus } from '@enums/transaction-status.enum';

@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(BalanceEntity)
    private balanceRepository: Repository<BalanceEntity>,
    @InjectRepository(PaymentTransactionEntity)
    private paymentTransactionRepository: Repository<PaymentTransactionEntity>,
  ) {}

  async getByUserId(userId: string): Promise<BalanceEntity> {
    const balance = await this.balanceRepository.findOneOrFail({
      where: { owner: { id: userId } },
      relations: ['paymentTransactions.order'],
      order: {
        paymentTransactions: {
          createdAt: 'DESC',
        },
      },
    });

    return balance;
  }

  async update(
    userId: string,
    amount: Decimal,
    manager: EntityManager,
    orderId?: string,
  ): Promise<BalanceEntity> {
    let balance = await manager.findOneOrFail(BalanceEntity, {
      where: { owner: { id: userId } },
      relations: ['paymentTransactions'],
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
    const balance = await this.update(
      userId,
      new Decimal(amount),
      this.balanceRepository.manager,
    );

    const transaction = balance.paymentTransactions[0];

    if (!transaction) {
      throw new HttpException('Транзакція не знайдена.', 400);
    }

    await this.paymentTransactionRepository.save({
      id: transaction.id,
      status: TransactionStatus.Success,
    });

    await this.paymentTransactionRepository.findOneOrFail({
      where: { id: transaction.id },
    });

    return this.getByUserId(userId);
  }

  async addFundsBanking(
    manager: EntityManager,
    userId: string,
    amount: number,
    bankTransactionId: string,
    paymentTransaction: PaymentTransactionEntity,
  ) {
    let balance = await manager.findOneOrFail(BalanceEntity, {
      where: { owner: { id: userId } },
    });

    await manager.save(PaymentTransactionEntity, {
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
  }

  async cancelTransactionBanking(
    manager: EntityManager,
    userId: string,
    amount: number,
    bankTransactionId: string,
    paymentTransaction: PaymentTransactionEntity,
  ) {
    let balance = await manager.findOneOrFail(BalanceEntity, {
      where: { owner: { id: userId } },
    });

    if (balance.amount.lessThan(amount)) {
      throw new HttpException('Недостатньо коштів на балансі.', 400);
    }

    await manager.save(PaymentTransactionEntity, {
      ...paymentTransaction,
      bankTransactionId,
      amount: new Decimal(amount),
      status: TransactionStatus.Cancelled,
    });

    await manager.save(BalanceEntity, {
      id: balance.id,
      amount: balance.amount.minus(amount),
      paymentTransactions: [...balance.paymentTransactions, paymentTransaction],
    });
  }
}
