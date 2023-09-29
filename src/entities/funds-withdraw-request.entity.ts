import Decimal from 'decimal.js';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

import { FundsWithdrawRequestStatus } from '../enums/funds-withdraw-request-status.enum';
import { DecimalTransformer } from '../transformers/decimal.transformer';
import { BaseEntity } from './base.entity';
import { FileEntity } from './file.entity';
import { PaymentTransactionEntity } from './payment-transaction.entity';
import { RequestEntity } from './request.entity';

@Entity('funds_withdrawal_request')
export class FundsWithdrawRequestEntity extends BaseEntity {
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
    transformer: new DecimalTransformer(),
  })
  amount: Decimal;

  @Column({
    type: 'enum',
    enum: FundsWithdrawRequestStatus,
    default: FundsWithdrawRequestStatus.Pending,
  })
  status: FundsWithdrawRequestStatus;

  @OneToOne(() => FileEntity, {
    eager: true,
  })
  @JoinColumn()
  fundsWithdrawalReceipt: FileEntity | null;

  @OneToOne(() => RequestEntity, (request) => request.fundsWithdrawalRequest)
  request: RequestEntity;

  @OneToMany(
    () => PaymentTransactionEntity,
    (transaction) => transaction.fundsWithdrawalRequest,
  )
  paymentTransactions: PaymentTransactionEntity[];
}
