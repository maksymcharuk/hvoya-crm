import { IsOptional, IsPhoneNumber, ValidateIf } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  firstName?: string;

  @IsOptional()
  lastName?: string;

  @IsOptional()
  middleName?: string;

  @ValidateIf((e) => e.phoneNumber)
  @IsOptional()
  @IsPhoneNumber('UA', { message: 'Номер телефону невірний' })
  phoneNumber?: string;

  @IsOptional()
  location?: string;

  @IsOptional()
  website?: string;

  @IsOptional()
  bio?: string;
}
