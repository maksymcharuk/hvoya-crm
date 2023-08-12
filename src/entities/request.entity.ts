import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { RequestType } from '../enums/request-type.enum';
import { BaseEntity } from './base.entity';
import { OrderReturnRequestEntity } from './order-return-request.entity';
import { UserEntity } from './user.entity';

@Entity('request')
export class RequestEntity extends BaseEntity {
  @Column({
    type: 'varchar',
    update: false,
    unique: true,
    nullable: true,
  })
  number: string | null;

  @Column({ type: 'varchar', nullable: true })
  customerComment: string;

  @Column({ type: 'varchar', nullable: true })
  managerComment: string;

  @Column({
    type: 'enum',
    enum: RequestType,
  })
  requestType: string;

  @Column()
  requestId: string;

  @OneToOne(() => OrderReturnRequestEntity, (request) => request.request)
  @JoinColumn({ name: 'requestId', referencedColumnName: 'id' })
  returnRequest?: OrderReturnRequestEntity;

  @ManyToOne(() => UserEntity, (user) => user.requests)
  customer: UserEntity;
}
