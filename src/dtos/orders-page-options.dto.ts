import { Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';

import { DeliveryService } from '@enums/delivery-service.enum';
import { DeliveryStatus } from '@enums/delivery-status.enum';
import { OrderStatus } from '@enums/order-status.enum';

import { PageOptionsDto } from './page-options.dto';

export class OrdersPageOptionsDto extends PageOptionsDto {
  @IsOptional()
  readonly searchQuery?: string;

  @IsOptional()
  @Transform(({ value }) => {
    const date = new Date(value);
    date.setHours(0, 0, 0, 0);
    return date;
  })
  readonly createdAt?: Date;

  @IsEnum(OrderStatus)
  @IsOptional()
  readonly status?: OrderStatus;

  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  readonly customerIds?: string[];

  @IsEnum(DeliveryStatus)
  @IsOptional()
  readonly deliveryStatus?: DeliveryStatus;

  @IsEnum(DeliveryService)
  @IsOptional()
  readonly deliveryService?: DeliveryService;
}
