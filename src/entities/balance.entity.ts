import Decimal from 'decimal.js';
import { Column, Entity, OneToMany, OneToOne, VersionColumn } from 'typeorm';

import { DecimalTransformer } from '../transformers/decimal.transformer';
import { BaseEntity } from './base.entity';
import { PaymentTransactionEntity } from './payment-transaction.entity';
import { UserEntity } from './user.entity';

@Entity('balance')
export class BalanceEntity extends BaseEntity {
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
    transformer: new DecimalTransformer(),
  })
  amount: Decimal;

  @OneToOne(() => UserEntity, (user) => user.balance)
  owner: UserEntity;

  @OneToMany(() => PaymentTransactionEntity, (transaction) => transaction.balance, { eager: true })
  paymentTransactions: PaymentTransactionEntity[];

  @VersionColumn()
  version: number;
}
