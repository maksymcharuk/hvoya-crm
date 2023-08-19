import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';

import { OrderReturnRequestItemDto } from './create-return-request.dto';

export class ApproveReturnRequestDto {
  @IsNotEmpty({ message: 'Необхідно вказати товари' })
  @ValidateNested({ each: true })
  @Type(() => OrderReturnRequestItemDto)
  approvedItems: OrderReturnRequestItemDto[];

  @IsOptional()
  deduction: number;

  @IsOptional()
  managerComment: string;
}
