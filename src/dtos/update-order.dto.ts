import { Transform } from 'class-transformer';
import {
  IsAlphanumeric,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidateIf,
} from 'class-validator';

import { PartialType } from '@nestjs/mapped-types';

import { OrderStatus } from '@enums/order-status.enum';

import { CreateOrderDto } from './create-order.dto';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsNotEmpty({ message: 'Необхідно вказати номер ТТН' })
  @Transform(({ value }) => value?.replaceAll(' ', ''))
  @IsAlphanumeric(undefined, {
    message: 'Номер ТТН повинен містити лише літери та цифри',
  })
  override trackingId: string;

  @IsOptional()
  @IsEnum(OrderStatus)
  orderStatus?: OrderStatus;

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
  orderStatusComment?: string;
}
