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

  @ValidateIf((e) => e.phoneNumber)
  @IsOptional()
  @IsPhoneNumber('UA', { message: 'Номер телефону недійсний' })
  phoneNumber?: string;

  @IsOptional()
  location?: string;

  @IsOptional()
  bio?: string;

  @ValidateIf((e) => e.cardNumber)
  @IsOptional()
  @IsCreditCard({ message: 'Номер картки недійсний' })
  cardNumber?: string;

  @ValidateIf((e) => e.cardNumber)
  @IsNotEmpty({ message: "Потрібне ім'я власника картки" })
  cardholderName?: string;
}
