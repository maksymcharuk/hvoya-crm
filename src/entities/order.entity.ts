import Decimal from 'decimal.js';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';

import { OrderStatus } from '../enums/order-status.enum';
import { DecimalTransformer } from '../transformers/decimal.transformer';
import { BaseEntity } from './base.entity';
import { OrderDeliveryEntity } from './order-delivery.entity';
import { OrderItemEntity } from './order-item.entity';
import { PaymentTransactionEntity } from './payment-transaction.entity';
import { UserEntity } from './user.entity';

@Entity('order')
export class OrderEntity extends BaseEntity {
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
    transformer: new DecimalTransformer(),
  })
  total: Decimal;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.Pending,
  })
  status: OrderStatus;

  @OneToMany(() => OrderItemEntity, (item) => item.order)
  items: OrderItemEntity[];

  @OneToOne(() => OrderDeliveryEntity)
  @JoinColumn()
  delivery: OrderDeliveryEntity;

  @OneToMany(() => PaymentTransactionEntity, (transaction) => transaction.order)
  paymentTransactions: PaymentTransactionEntity[];

  @ManyToOne(() => UserEntity, (user) => user.orders)
  customer: UserEntity;
}
