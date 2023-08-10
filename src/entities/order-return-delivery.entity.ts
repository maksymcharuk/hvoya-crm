import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { DeliveryService } from '../enums/delivery-service.enum';
import { DeliveryStatus } from '../enums/delivery-status.enum';
import { BaseEntity } from './base.entity';
import { FileEntity } from './file.entity';

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
    enum: DeliveryStatus,
    default: DeliveryStatus.Pending,
  })
  status: DeliveryStatus;

  @Column({ default: '' })
  rawStatus: string;
}
