import { IsEnum, IsNotEmpty } from 'class-validator';

import { DeliveryService } from '@enums/delivery-service.enum';

export class CreateOrderDto {
  @IsNotEmpty({ message: 'Необхідно вказати номер ТТН' })
  trackingId: string;

  @IsEnum(DeliveryService)
  @IsNotEmpty({ message: 'Необхідно вказати службу доставки' })
  deliveryService: DeliveryService;

  // NOTE: Keep this for a waybill generation logic in future
  // @IsNotEmpty()
  // @IsEmail()
  // email: string;

  // @IsNotEmpty()
  // @IsString()
  // firstName: string;

  // @IsNotEmpty()
  // @IsString()
  // lastName: string;

  // @IsNotEmpty()
  // @IsString()
  // middleName: string;

  // @IsNotEmpty()
  // @IsPhoneNumber('UA', { message: 'Номер телефону недійсний' })
  // phoneNumber: string;

  // @IsEnum(DeliveryType)
  // @IsNotEmpty()
  // deliveryType: DeliveryType;

  // @IsNotEmpty()
  // @IsString()
  // city: string;

  // @IsNotEmpty()
  // postOffice: string;
}
