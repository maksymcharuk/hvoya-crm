import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';

@Entity('notification')
export class NotificationEntity extends BaseEntity {
  @Column()
  message: string;

  @Column()
  url: string;

  @Column({ default: false })
  checked: boolean;

  @ManyToOne(() => UserEntity, (user) => user.notifications)
  user: UserEntity;
}
