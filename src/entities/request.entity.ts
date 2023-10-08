import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
} from 'typeorm';

import { RequestType } from '../enums/request-type.enum';
import { BaseEntity } from './base.entity';
import { FileEntity } from './file.entity';
import { FundsWithdrawRequestEntity } from './funds-withdraw-request.entity';
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
  requestType: RequestType;

  @OneToOne(() => OrderReturnRequestEntity, (request) => request.request)
  @JoinColumn()
  returnRequest?: OrderReturnRequestEntity;

  @OneToOne(() => FundsWithdrawRequestEntity, (request) => request.request)
  @JoinColumn()
  fundsWithdrawalRequest?: FundsWithdrawRequestEntity;

  @ManyToOne(() => UserEntity, (user) => user.requests)
  customer: UserEntity;

  @ManyToMany(() => FileEntity, {
    eager: true,
  })
  @JoinTable()
  customerImages: FileEntity[];

  @ManyToMany(() => FileEntity, {
    eager: true,
  })
  @JoinTable()
  managerImages: FileEntity[];
}
