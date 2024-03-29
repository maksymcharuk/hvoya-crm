import { Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';

import { DeliveryStatus } from '@enums/delivery-status.enum';
import { OrderReturnRequestStatus } from '@enums/order-return-request-status.enum';
import { RequestType } from '@enums/request-type.enum';

import { PageOptionsDto } from './page-options.dto';

export class RequestsPageOptionsDto extends PageOptionsDto {
  @IsOptional()
  readonly searchQuery?: string;

  @IsOptional()
  @Transform(({ value }) => {
    const date = new Date(value);
    date.setHours(0, 0, 0, 0);
    return date;
  })
  readonly createdAt?: Date;

  @IsEnum(OrderReturnRequestStatus)
  @IsOptional()
  readonly requestStatus: OrderReturnRequestStatus;

  @IsEnum(RequestType)
  @IsOptional()
  readonly requestType: RequestType;

  @IsEnum(DeliveryStatus)
  @IsOptional()
  readonly orderReturnRequestDeliveryStatus: DeliveryStatus;

  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  readonly customerIds?: string[];

  constructor(partial: Partial<RequestsPageOptionsDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
