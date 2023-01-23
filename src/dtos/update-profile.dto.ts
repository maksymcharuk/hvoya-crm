import {
  IsCreditCard,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  ValidateIf,
} from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  firstName?: string;

  @IsOptional()
  lastName?: string;

  @ValidateIf((e) => e.phoneNumber !== '')
  @IsOptional()
  @IsPhoneNumber('UA', { message: 'Phone number is not valid' })
  phoneNumber?: string;

  @IsOptional()
  location?: string;

  @IsOptional()
  bio?: string;

  @ValidateIf((e) => e.cardNumber !== '')
  @IsOptional()
  @IsCreditCard({ message: 'Card number is not valid' })
  cardNumber?: string;

  @ValidateIf((e) => e.cardNumber !== '')
  @IsNotEmpty({ message: 'Cardholder name is required' })
  cardholderName?: string;
}
