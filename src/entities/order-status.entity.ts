import { Column, Entity, ManyToOne } from 'typeorm';

import { OrderStatus } from '../enums/order-status.enum';
import { BaseEntity } from './base.entity';
import { OrderEntity } from './order.entity';
import { UserEntity } from './user.entity';

@Entity('order_status')
export class OrderStatusEntity extends BaseEntity {
  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.Pending,
  })
  status: OrderStatus;

  @Column({ default: '' })
  comment: string;

  @ManyToOne(() => OrderEntity, (order) => order.statuses)
  order: OrderEntity;

  @ManyToOne(() => UserEntity, { eager: true })
  createdBy: UserEntity;
}
