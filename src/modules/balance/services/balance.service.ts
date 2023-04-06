import Decimal from 'decimal.js';

import { EntityManager, Repository } from 'typeorm';

import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BalanceEntity } from '@entities/balance.entity';
import { PaymentTransactionEntity } from '@entities/payment-transaction.entity';
import { OrderEntity } from '@entities/order.entity';

import { TransactionStatus } from '@enums/transaction-status.enum';

@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(BalanceEntity)
    private balanceRepository: Repository<BalanceEntity>,
  ) { }

  getByUserId(userId: number): Promise<BalanceEntity> {
    return this.balanceRepository.findOneOrFail({
      where: { owner: { id: userId } },
      relations: ['paymentTransactions.order'],
      order: {
        paymentTransactions: {
          createdAt: 'DESC'
        }
      },
    });
  }

  async update(userId: number, amount: Decimal, manager: EntityManager, orderId?: number): Promise<BalanceEntity> {
    let balance = await manager.findOneOrFail(BalanceEntity, { where: { owner: { id: userId } } });

    const paymentTransaction = await manager.create(
      PaymentTransactionEntity,
      { amount },
    );

    if (orderId) {
      paymentTransaction.order = { id: orderId } as OrderEntity;
    }

    await manager.save(PaymentTransactionEntity, paymentTransaction);

    if (amount.isNegative()) {
      if (balance.amount.lessThan(amount.neg())) {
        throw new HttpException('Недостатньо коштів на балансі.', 400);
      }

      manager.save(BalanceEntity, {
        id: balance.id,
        amount: balance.amount.minus(amount.neg()),
        paymentTransactions: [...balance.paymentTransactions, paymentTransaction]
      });
    } else {
      manager.save(BalanceEntity, {
        id: balance.id,
        amount: balance.amount.plus(amount),
        paymentTransactions: [...balance.paymentTransactions, paymentTransaction]
      });
    }

    return this.getByUserId(userId);
  }

  // temporary "testing" solution;
  async addFunds(userId: number, amount: number): Promise<BalanceEntity> {
    return await this.update(userId, new Decimal(amount), this.balanceRepository.manager);
  }

  async addFundsBanking(manager: EntityManager, userId: number, amount: number, bankTransactionId: string, paymentTransaction: PaymentTransactionEntity) {
    let balance = await manager.findOneOrFail(BalanceEntity, { where: { owner: { id: userId } } });

    await manager.save(PaymentTransactionEntity, {
      ...paymentTransaction,
      bankTransactionId,
      amount: new Decimal(amount),
      status: TransactionStatus.Success,
    });

    await manager.save(BalanceEntity, {
      id: balance.id,
      amount: balance.amount.plus(amount),
      paymentTransactions: [...balance.paymentTransactions, paymentTransaction]
    });
  }

  async cancelTransactionBanking(manager: EntityManager, userId: number, amount: number, bankTransactionId: string, paymentTransaction: PaymentTransactionEntity) {
    let balance = await manager.findOneOrFail(BalanceEntity, { where: { owner: { id: userId } } });

    await manager.save(PaymentTransactionEntity, {
      ...paymentTransaction,
      bankTransactionId,
      amount: new Decimal(amount),
      status: TransactionStatus.Cancelled,
    });

    await manager.save(BalanceEntity, {
      id: balance.id,
      amount: balance.amount.minus(amount),
      paymentTransactions: [...balance.paymentTransactions, paymentTransaction]
    });

  }

}
