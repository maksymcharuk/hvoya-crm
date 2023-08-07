import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { BaseEntity } from './base.entity';
import { FileEntity } from './file.entity';

import { DeliveryService } from '../enums/delivery-service.enum';
import { ReturnRequestDeliveryStatus } from '../enums/return-request-delivery-status.enum';

@Entity('order_return_delivery')
export class OrderReturnDeliveryEntity extends BaseEntity {

  @Column()
  trackingId: string;

  @OneToOne(() => FileEntity, {
    eager: true,
  })
  @JoinColumn()
  waybill: FileEntity | null;

  @Column({
    type: 'enum',
    enum: DeliveryService,
    nullable: true,
  })
  deliveryService: DeliveryService | null;

  @Column({
    type: 'enum',
    enum: ReturnRequestDeliveryStatus,
    default: ReturnRequestDeliveryStatus.Pending,
  })
  status: ReturnRequestDeliveryStatus;

  @Column({ default: '' })
  rawStatus: string;
}
