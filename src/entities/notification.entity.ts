import { Column, Entity, ManyToOne } from 'typeorm';

import { NotificationData } from '@interfaces/notifications/notification-data.interface';

import { NotificationType } from '../enums/notification-type.enum';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';

@Entity('notification')
export class NotificationEntity extends BaseEntity {
  @Column({
    type: 'varchar',
    nullable: true,
  })
  message: string | null;

  @Column('simple-json', { nullable: true })
  data: NotificationData;

  @Column({ default: false })
  checked: boolean;

  @Column({
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.Info,
  })
  type: NotificationType;

  @ManyToOne(() => UserEntity, (user) => user.notifications)
  user: UserEntity;
}
