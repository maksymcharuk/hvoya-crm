import { IsCreditCard, IsOptional, IsPhoneNumber } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  firstName?: string;

  @IsOptional()
  lastName?: string;

  @IsPhoneNumber()
  @IsOptional()
  phoneNumber?: string;

  @IsOptional()
  location?: string;

  @IsOptional()
  bio?: string;

  @IsCreditCard()
  @IsOptional()
  cardNumber?: string;

  @IsOptional()
  cardholderName?: string;
}
