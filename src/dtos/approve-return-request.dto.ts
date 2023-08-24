import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';

import { OrderReturnRequestItemDto } from './create-return-request.dto';

export class ApproveReturnRequestDto {
  @IsNotEmpty({ message: 'Необхідно вказати товари' })
  @Transform(({ value }) =>
    JSON.parse(value).map((item: any) => new OrderReturnRequestItemDto(item)),
  )
  @ValidateNested({ each: true, always: true })
  @Type(() => OrderReturnRequestItemDto)
  approvedItems: OrderReturnRequestItemDto[];

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  deduction: number = 0;

  @IsOptional()
  managerComment?: string;
}
