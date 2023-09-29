import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import Decimal from 'decimal.js';

export class CreateFundsWithdrawRequestDto {
  @IsNotEmpty({ message: 'Необхідно вказати суму зняття коштів' })
  @Transform(({ value }) => new Decimal(value))
  amount: Decimal;
}
