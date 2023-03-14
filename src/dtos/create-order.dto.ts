import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

import { DeliveryService } from '@enums/delivery-service.enum';

export class CreateOrderDto {
  @IsNotEmpty()
  trackingId: string;

  @IsEnum(DeliveryService)
  @IsNotEmpty()
  deliveryService: DeliveryService;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  middleName: string;

  @IsNotEmpty()
  @IsPhoneNumber('UA', { message: 'Номер телефону недійсний' })
  phoneNumber: string;

  @IsNotEmpty()
  deliveryType: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  postOffice: string;
}
