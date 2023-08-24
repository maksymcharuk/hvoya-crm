import Decimal from 'decimal.js';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

import { OrderReturnRequestStatus } from '../enums/order-return-request-status.enum';
import { DecimalTransformer } from '../transformers/decimal.transformer';
import { BaseEntity } from './base.entity';
import { OrderReturnDeliveryEntity } from './order-return-delivery.entity';
import { OrderReturnRequestItemEntity } from './order-return-request-item.entity';
import { OrderEntity } from './order.entity';
import { PaymentTransactionEntity } from './payment-transaction.entity';
import { RequestEntity } from './request.entity';

@Entity('order_return_request')
export class OrderReturnRequestEntity extends BaseEntity {
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
    transformer: new DecimalTransformer(),
  })
  deduction: Decimal;

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
    enum: OrderReturnRequestStatus,
    default: OrderReturnRequestStatus.Pending,
  })
  status: OrderReturnRequestStatus;

  @OneToOne(() => OrderReturnDeliveryEntity)
  @JoinColumn()
  delivery: OrderReturnDeliveryEntity;

  @OneToOne(() => OrderEntity, (order) => order.returnRequest)
  @JoinColumn()
  order: OrderEntity;

  @OneToOne(() => RequestEntity, (request) => request.returnRequest)
  request: RequestEntity;

  @OneToMany(
    () => OrderReturnRequestItemEntity,
    (item) => item.orderReturnRequested,
  )
  requestedItems: OrderReturnRequestItemEntity[];

  @OneToMany(
    () => OrderReturnRequestItemEntity,
    (item) => item.orderReturnApproved,
  )
  approvedItems: OrderReturnRequestItemEntity[];

  @OneToMany(
    () => PaymentTransactionEntity,
    (transaction) => transaction.orderReturnRequest,
  )
  paymentTransactions: PaymentTransactionEntity[];
}
