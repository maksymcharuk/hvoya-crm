import Decimal from 'decimal.js';
import { Column, Entity, ManyToOne } from 'typeorm';

import { TransactionStatus } from '../enums/transaction-status.enum';
import { TransactionSyncOneCStatus } from '../enums/transaction-sync-one-c-status.enum';
import { DecimalTransformer } from '../transformers/decimal.transformer';
import { BalanceEntity } from './balance.entity';
import { BaseEntity } from './base.entity';
import { OrderReturnRequestEntity } from './order-return-request.entity';
import { OrderEntity } from './order.entity';

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

  @Column({
    type: 'enum',
    enum: TransactionSyncOneCStatus,
    default: TransactionSyncOneCStatus.Pending,
  })
  syncOneCStatus: TransactionSyncOneCStatus;

  @ManyToOne(() => OrderEntity, (order) => order.paymentTransactions)
  order: OrderEntity;

  @ManyToOne(
    () => OrderReturnRequestEntity,
    (request) => request.paymentTransactions,
  )
  orderReturnRequest: OrderReturnRequestEntity;

  @ManyToOne(() => BalanceEntity, (balance) => balance.paymentTransactions)
  balance: BalanceEntity;
}
