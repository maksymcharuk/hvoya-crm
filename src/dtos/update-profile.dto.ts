import { Cyrillic } from '@root/validators/сyrillic.validator';
import { IsOptional, IsPhoneNumber, ValidateIf } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @Cyrillic({ message: "Ім'я повинен містити лише літери українського алфавіту" })
  firstName?: string;

  @IsOptional()
  @Cyrillic({ message: "Прізвище повинен містити лише літери українського алфавіту" })
  lastName?: string;

  @IsOptional()
  @Cyrillic({ message: "По батькові повинен містити лише літери українського алфавіту" })
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
