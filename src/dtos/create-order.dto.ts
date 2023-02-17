import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  trackingId: string;

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
  @IsPhoneNumber('UA', { message: 'Phone number is not valid' })
  phoneNumber: string;

  @IsNotEmpty()
  deliveryType: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  postOffice: string;
}
