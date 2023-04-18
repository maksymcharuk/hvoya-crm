import Decimal from 'decimal.js';
import { Column, Entity, ManyToOne } from 'typeorm';

import { DecimalTransformer } from '../transformers/decimal.transformer';
import { BalanceEntity } from './balance.entity';
import { BaseEntity } from './base.entity';
import { OrderEntity } from './order.entity';
import { TransactionStatus } from '../enums/transaction-status.enum';

@Entity('payment_transaction')
export class PaymentTransactionEntity extends BaseEntity {
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
    transformer: new DecimalTransformer(),
  })
  amount: Decimal;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.Pending,
  })
  status: TransactionStatus;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  bankTransactionId: string | null;

  @ManyToOne(() => OrderEntity, (order) => order.paymentTransactions)
  order: OrderEntity;

  @ManyToOne(() => BalanceEntity, (balance) => balance.paymentTransactions)
  balance: BalanceEntity;
}
