import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { BaseEntity } from './base.entity';
import { OrderItemEntity } from './order-item.entity';
import { OrderReturnRequestEntity } from './order-return-request.entity';

@Entity('order_return_request_item')
export class OrderReturnRequestItemEntity extends BaseEntity {

  @Column()
  quantity: number;

  @Column({ default: false })
  approved: boolean;

  @OneToOne(() => OrderItemEntity)
  @JoinColumn()
  orderItem: OrderItemEntity;

  @ManyToOne(() => OrderReturnRequestEntity, (orderReturnRequest) => orderReturnRequest.requestedItems)
  orderReturnRequested: OrderReturnRequestEntity;

  @ManyToOne(() => OrderReturnRequestEntity, (orderReturnRequest) => orderReturnRequest.approvedItems)
  orderReturnApproved: OrderReturnRequestEntity;
}
