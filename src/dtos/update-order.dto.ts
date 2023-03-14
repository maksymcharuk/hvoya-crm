import { IsEnum, IsOptional } from 'class-validator';

import { PartialType } from '@nestjs/mapped-types';

import { OrderStatus } from '@enums/order-status.enum';

import { CreateOrderDto } from './create-order.dto';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsOptional()
  @IsEnum(OrderStatus)
  orderStatus: OrderStatus;
}
