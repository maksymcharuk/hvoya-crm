import { IsNotEmpty, IsOptional } from 'class-validator';

import { OrderReturnRequestItemDto } from './create-return-request.dto';

export class ApproveReturnRequestDto {
  @IsNotEmpty({ message: 'Необхідно вказати товари' })
  approvedItems: OrderReturnRequestItemDto[];

  @IsOptional()
  deduction: number;

  @IsOptional()
  managerComment: number;
}
