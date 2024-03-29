import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { DeliveryService } from '../enums/delivery-service.enum';
import { DeliveryStatus } from '../enums/delivery-status.enum';
import { DeliveryType } from '../enums/delivery-type.enum';
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
    enum: DeliveryStatus,
    default: DeliveryStatus.Pending,
  })
  status: DeliveryStatus;

  @Column({
    default: '',
  })
  rawStatus: string;

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
    type: 'enum',
    enum: DeliveryType,
    nullable: true,
  })
  deliveryType: DeliveryType | null;

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
