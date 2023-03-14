import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { DeliveryService } from '../enums/delivery-service.enum';
import { OrderDeliveryStatus } from '../enums/order-delivery-status.enum';
import { BaseEntity } from './base.entity';
import { FileEntity } from './file.entity';

@Entity('order_delivery')
export class OrderDeliveryEntity extends BaseEntity {
  @Column({
    default: '',
  })
  trackingId: string;

  @Column({
    type: 'enum',
    enum: DeliveryService,
    nullable: true,
  })
  deliveryService: DeliveryService | null;

  @Column({
    type: 'enum',
    enum: OrderDeliveryStatus,
    default: OrderDeliveryStatus.Pending,
  })
  status: OrderDeliveryStatus;

  @Column({
    default: '',
  })
  email: string;

  @Column({
    default: '',
  })
  firstName: string;

  @Column({
    default: '',
  })
  lastName: string;

  @Column({
    default: '',
  })
  middleName: string;

  @Column({
    default: '',
  })
  phoneNumber: string;

  @Column({
    default: '',
  })
  deliveryType: string;

  @Column({
    default: '',
  })
  city: string;

  @Column({
    default: '',
  })
  postOffice: string;

  @OneToOne(() => FileEntity, {
    eager: true,
  })
  @JoinColumn()
  waybill: FileEntity | null;
}
