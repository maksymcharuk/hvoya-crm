import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

import { PartialType } from '@nestjs/mapped-types';

import { OrderStatus } from '@enums/order-status.enum';

import { CreateOrderDto } from './create-order.dto';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsNotEmpty({ message: 'Необхідно вказати номер ТТН' })
  override trackingId: string;

  @IsOptional()
  @IsEnum(OrderStatus)
  orderStatus: OrderStatus;
}
