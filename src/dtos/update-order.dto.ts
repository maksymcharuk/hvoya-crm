import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

import { PartialType } from '@nestjs/mapped-types';

import { OrderStatus } from '@enums/order-status.enum';

import { CreateOrderDto } from './create-order.dto';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsNotEmpty({ message: 'Необхідно вказати номер ТТН' })
  override trackingId: string;

  @IsOptional()
  @IsEnum(OrderStatus)
  orderStatus: OrderStatus;

  @IsString()
  @ValidateIf((o) => {
    return [
      // Comment is required if order status is one of the following:
      OrderStatus.Cancelled,
      OrderStatus.Fulfilled,
      OrderStatus.Refunded,
      OrderStatus.TransferedToDelivery,
    ].includes(o.orderStatus);
  })
  @IsNotEmpty({ message: 'Необхідно вказати причину зміни на даний статус' })
  orderStatusComment: string;
}
