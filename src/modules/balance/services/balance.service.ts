import Decimal from 'decimal.js';

import { EntityManager, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BalanceEntity } from '@entities/balance.entity';
import { PaymentTransactionEntity } from '@entities/payment-transaction.entity';
import { OrderEntity } from '@entities/order.entity';

@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(BalanceEntity)
    private balanceRepository: Repository<BalanceEntity>,
  ) { }

  getByUserId(userId: number): Promise<BalanceEntity> {
    return this.balanceRepository.findOneByOrFail({ id: userId });
  }

  async update(balanceId: number, amount: Decimal, manager: EntityManager, orderId?: number): Promise<BalanceEntity> {
    let balance = await manager.findOneOrFail(BalanceEntity, { where: { id: balanceId }, relations: ['paymentTransactions'] });

    const paymentTransaction = await manager.create(
      PaymentTransactionEntity,
      { amount },
    );

    if (orderId) {
      paymentTransaction.order = { id: orderId } as OrderEntity;
    }

    await manager.save(PaymentTransactionEntity, paymentTransaction);

    if (amount.isNegative()) {
      return manager.save(BalanceEntity, {
        id: balanceId,
        amount: balance.amount.minus(amount.neg()),
        paymentTransactions: [...balance.paymentTransactions, paymentTransaction]
      });
    } else {
      return manager.save(BalanceEntity, {
        id: balanceId,
        amount: balance.amount.plus(amount),
        paymentTransactions: [...balance.paymentTransactions, paymentTransaction]
      });
    }
  }


}
