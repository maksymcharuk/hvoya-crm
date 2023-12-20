import { Transform, Type } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';

import { TransactionStatus } from '@enums/transaction-status.enum';

import { PageOptionsDto } from './page-options.dto';

export class PaymentTransactionsPageOptionsDto extends PageOptionsDto {
  @IsOptional()
  readonly searchQuery?: string;

  @IsOptional()
  @Transform(({ value }) => {
    const date = new Date(value);
    date.setHours(0, 0, 0, 0);
    return date;
  })
  readonly updatedAt?: Date;

  @Type(() => Number)
  @IsOptional()
  readonly amount?: number;

  @IsEnum(() => TransactionStatus)
  @IsOptional()
  readonly status?: TransactionStatus;

  constructor(partial: Partial<PaymentTransactionsPageOptionsDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
