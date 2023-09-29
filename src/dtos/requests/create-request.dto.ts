import { Transform, Type, plainToClass } from 'class-transformer';
import { IsNotEmpty, ValidateIf, ValidateNested } from 'class-validator';

import { RequestType } from '@enums/request-type.enum';

import { CreateFundsWithdrawRequestDto } from './funds-withdraw-requests/create-funds-withdraw-request.dto';
import { CreateReturnRequestDto } from './return-requests/create-return-request.dto';

export class CreateRequestDto {
  @ValidateIf((o) => o.requestType === RequestType.Return)
  @IsNotEmpty({ message: 'Необхідно вказати причину повернення' })
  customerComment: string;

  @IsNotEmpty()
  requestType: RequestType;

  @ValidateIf((o) => o.requestType === RequestType.Return)
  @Transform(({ value }) => {
    value = typeof value === 'string' ? JSON.parse(value) : value;
    return plainToClass(CreateReturnRequestDto, value);
  })
  @ValidateNested({ always: true })
  @Type(() => CreateReturnRequestDto)
  returnRequest: CreateReturnRequestDto;

  @ValidateIf((o) => o.requestType === RequestType.FundsWithdrawal)
  @Transform(({ value }) => {
    value = typeof value === 'string' ? JSON.parse(value) : value;
    return plainToClass(CreateFundsWithdrawRequestDto, value);
  })
  @ValidateNested({ always: true })
  @Type(() => CreateFundsWithdrawRequestDto)
  fundsWithdrawalRequest: CreateFundsWithdrawRequestDto;
}
