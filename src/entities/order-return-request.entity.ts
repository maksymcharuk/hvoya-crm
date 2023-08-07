import Decimal from 'decimal.js';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { DecimalTransformer } from '../transformers/decimal.transformer';

import { BaseEntity } from './base.entity';
import { OrderReturnRequestItemEntity } from './order-return-request-item.entity';
import { OrderEntity } from './order.entity';
import { RequestEntity } from './request.entity';
import { OrderReturnDeliveryEntity } from './order-return-delivery.entity';

import { OrderReturnRequestStatus } from '../enums/order-return-request-status.enum';

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

  @OneToOne(() => OrderEntity)
  @JoinColumn()
  order: OrderEntity;

  @OneToMany(() => OrderReturnRequestItemEntity, (item) => item.orderReturnRequested)
  requestedItems: OrderReturnRequestItemEntity[];

  @OneToMany(() => OrderReturnRequestItemEntity, (item) => item.orderReturnApproved)
  approvedItems: OrderReturnRequestItemEntity[];

  @OneToOne(() => RequestEntity, (request) => request.returnRequest)
  request: RequestEntity;
}
