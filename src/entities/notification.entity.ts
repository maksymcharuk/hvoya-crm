import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';

import { NotificationData } from '../interfaces/notifications/notification-data.interface';

@Entity('notification')
export class NotificationEntity extends BaseEntity {
  @Column()
  message: string;

  @Column("simple-json", { nullable: true })
  data: NotificationData | null;

  @Column({ default: false })
  checked: boolean;

  @Column({ default: 'info' })
  type: string;

  @ManyToOne(() => UserEntity, (user) => user.notifications)
  user: UserEntity;
}
