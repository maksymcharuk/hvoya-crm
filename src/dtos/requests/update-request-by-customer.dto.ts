import { Transform, Type, plainToClass } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

import { UpdateReturnRequestByCustomerDto } from './return-requests/update-return-request-by-customer.dto';

export class UpdateRequestByCustomerDto {
  @IsOptional()
  @Transform(({ value }) => {
    value = typeof value === 'string' ? JSON.parse(value) : value;
    return plainToClass(UpdateReturnRequestByCustomerDto, value);
  })
  @ValidateNested({ always: true })
  @Type(() => UpdateReturnRequestByCustomerDto)
  returnRequest: UpdateReturnRequestByCustomerDto;
}
