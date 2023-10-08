import { Transform, Type, plainToClass } from 'class-transformer';
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';

import { OrderReturnRequestItemDto } from './create-return-request.dto';

export class ApproveReturnRequestDto {
  @IsNotEmpty({ message: 'Необхідно вказати товари' })
  @Transform(({ value }) => {
    value = typeof value === 'string' ? JSON.parse(value) : value;
    return value.map((item: any) =>
      plainToClass(OrderReturnRequestItemDto, item),
    );
  })
  @ValidateNested({ each: true, always: true })
  @Type(() => OrderReturnRequestItemDto)
  approvedItems: OrderReturnRequestItemDto[];

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  deduction: number = 0;
}
