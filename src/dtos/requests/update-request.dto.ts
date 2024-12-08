import { Transform, Type, plainToClass } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

import { UpdateReturnRequestDto } from './return-requests/update-return-request.dto';

export class UpdateRequestDto {
  @IsOptional()
  @Transform(({ value }) => {
    value = typeof value === 'string' ? JSON.parse(value) : value;
    return plainToClass(UpdateReturnRequestDto, value);
  })
  @ValidateNested({ always: true })
  @Type(() => UpdateReturnRequestDto)
  returnRequest: UpdateReturnRequestDto;
}
