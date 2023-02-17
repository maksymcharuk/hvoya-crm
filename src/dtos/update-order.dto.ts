import { IsEnum, IsOptional } from 'class-validator';

import { PartialType } from '@nestjs/mapped-types';

import { OrderDeliveryStatus } from '@enums/order-delivery-status.enum';
import { OrderStatus } from '@enums/order-status.enum';

import { CreateOrderDto } from './create-order.dto';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsOptional()
  @IsEnum(OrderStatus)
  orderStatus: OrderStatus;

  @IsOptional()
  @IsEnum(OrderDeliveryStatus)
  deliveryStatus: OrderDeliveryStatus;
}
