import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';

@Entity('post')
export class PostEntity extends BaseEntity {
  @Column()
  body: string;

  @Column({ default: false })
  isPublished: boolean;

  @ManyToOne(() => UserEntity)
  @JoinColumn([{ name: 'createdById', referencedColumnName: 'id' }])
  createdBy: UserEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn([{ name: 'updatedById', referencedColumnName: 'id' }])
  updatedBy: UserEntity;
}
