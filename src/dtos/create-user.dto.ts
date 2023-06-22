import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  Length,
  ValidateNested,
} from 'class-validator';

import { Role } from '@enums/role.enum';

import { BaseRelationDto } from './shared/base-relation.dto';

export class CreateUserDto {
  @IsEmail({}, { message: 'Невірний формат електронної пошти' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: "Потрібно вказати ім'я" })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'Потрібно вказати прізвище' })
  lastName: string;

  @IsString()
  @IsNotEmpty({ message: 'Потрібно вказати по-батькові' })
  middleName: string;

  @IsNotEmpty({ message: 'Потрібно ввести пароль' })
  password: string;

  @IsNotEmpty()
  @Length(10, 10, { message: 'Номер телефону невірний' })
  @IsPhoneNumber('UA', { message: 'Номер телефону невірний' })
  phoneNumber: string;

  @IsNotEmpty({ message: 'Потрібно ввести назву магазину' })
  storeName: string;

  @IsNotEmpty()
  @IsUrl(
    {},
    {
      message:
        'Невірний формат посилання на веб-сайт чи профіль у соціальній мережі',
    },
  )
  website: string;

  @IsNotEmpty({ message: 'Потрібно додати опис' })
  bio: string;

  @IsString()
  @IsOptional()
  note?: string = '';

  @IsEnum(Role, { message: 'Невірна роль' })
  @IsOptional()
  role?: Role = Role.User;

  @IsBoolean()
  @IsOptional()
  emailConfirmed?: boolean = false;

  @IsBoolean()
  @IsOptional()
  userConfirmed?: boolean = false;

  @IsBoolean()
  @IsOptional()
  userFreezed?: boolean = false;

  @IsString()
  @IsOptional()
  accountNumber?: string | null = null;

  @IsBoolean()
  @IsOptional()
  userTest?: boolean = false;

  @ValidateNested()
  @Type(() => BaseRelationDto)
  @IsOptional()
  manager?: BaseRelationDto;
}
