import Decimal from 'decimal.js';
import { Column, Entity, ManyToOne } from 'typeorm';

import { PaymentTransactionStatus } from '../enums/payment-transaction-status.enum';
import { DecimalTransformer } from '../transformers/decimal.transformer';
import { BaseEntity } from './base.entity';
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
    enum: PaymentTransactionStatus,
    default: PaymentTransactionStatus.Pending,
  })
  status: PaymentTransactionStatus;

  @ManyToOne(() => OrderEntity, (order) => order.items)
  order: OrderEntity;
}
