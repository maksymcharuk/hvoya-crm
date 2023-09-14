import { Transform, Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

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
  readonly createdAt?: Date;

  @Type(() => Number)
  @IsOptional()
  readonly amount?: number;
}
