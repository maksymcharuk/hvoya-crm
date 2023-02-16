import { Column, Entity, OneToOne } from 'typeorm';

import { OrderDeliveryStatus } from '../enums/order-delivery-status.enum';
import { BaseEntity } from './base.entity';
import { FileEntity } from './file.entity';

@Entity('order_delivery')
export class OrderDeliveryEntity extends BaseEntity {
  @Column()
  trackingId: string;

  @Column({
    type: 'enum',
    enum: OrderDeliveryStatus,
    default: OrderDeliveryStatus.Pending,
  })
  status: OrderDeliveryStatus;

  @OneToOne(() => FileEntity)
  waybill: FileEntity;
}
