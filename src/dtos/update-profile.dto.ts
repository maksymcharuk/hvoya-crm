import { Cyrillic } from '@root/validators/сyrillic.validator';
import { IsOptional, IsPhoneNumber, ValidateIf } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @Cyrillic()
  firstName?: string;

  @IsOptional()
  @Cyrillic()
  lastName?: string;

  @IsOptional()
  @Cyrillic()
  middleName?: string;

  @ValidateIf((e) => e.phoneNumber)
  @IsOptional()
  @IsPhoneNumber('UA', { message: 'Номер телефону невірний' })
  phoneNumber?: string;

  @IsOptional()
  storeName?: string;

  @IsOptional()
  website?: string;

  @IsOptional()
  bio?: string;
}
