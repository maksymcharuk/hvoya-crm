import Decimal from 'decimal.js';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';

import { DecimalTransformer } from '../transformers/decimal.transformer';
import { BaseEntity } from './base.entity';
import { OrderDeliveryEntity } from './order-delivery.entity';
import { OrderItemEntity } from './order-item.entity';
import { OrderStatusEntity } from './order-status.entity';
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
    type: 'varchar',
    update: false,
    unique: true,
    nullable: true,
  })
  number: string | null;

  @Column({ default: '' })
  customerNote: string;

  @Column({ default: '' })
  managerNote: string;

  @OneToMany(() => OrderStatusEntity, (status) => status.order)
  statuses: OrderStatusEntity[];

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
