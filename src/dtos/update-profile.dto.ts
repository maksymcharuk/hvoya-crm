import { IsCreditCard, IsOptional, IsPhoneNumber } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  firstName?: string;

  @IsOptional()
  lastName?: string;

  @IsPhoneNumber('UA', { message: 'Phone number is not valid' })
  @IsOptional()
  phoneNumber?: string;

  @IsOptional()
  location?: string;

  @IsOptional()
  bio?: string;

  @IsCreditCard({ message: 'Card number is not valid' })
  @IsOptional()
  cardNumber?: string;

  @IsOptional()
  cardholderName?: string;
}
