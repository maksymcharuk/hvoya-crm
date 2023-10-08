import { Transform, Type, plainToClass } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

import { ApproveReturnRequestDto } from './return-requests/approve-return-request.dto';

export class ApproveRequestDto {
  @IsOptional()
  @Transform(({ value }) => {
    value = typeof value === 'string' ? JSON.parse(value) : value;
    return plainToClass(ApproveReturnRequestDto, value);
  })
  @ValidateNested({ always: true })
  @Type(() => ApproveReturnRequestDto)
  returnRequest: ApproveReturnRequestDto;

  @IsOptional()
  managerComment?: string;
}
