import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

import { Cyrillic } from '@root/validators/сyrillic.validator';

export class AuthSignUpDto {
  @IsEmail({}, { message: 'Невірний формат електронної пошти' })
  email: string;

  @IsString()
  @Cyrillic({
    message: "Ім'я повинен містити лише літери українського алфавіту",
  })
  @IsNotEmpty({ message: "Потрібно вказати ім'я" })
  firstName: string;

  @IsString()
  @Cyrillic({
    message: 'Прізвище повинен містити лише літери українського алфавіту',
  })
  @IsNotEmpty({ message: 'Потрібно вказати прізвище' })
  lastName: string;

  @IsString()
  @Cyrillic({
    message: 'По батькові повинен містити лише літери українського алфавіту',
  })
  @IsNotEmpty({ message: 'Потрібно вказати по-батькові' })
  middleName: string;

  @IsNotEmpty({ message: 'Потрібно ввести пароль' })
  password: string;

  @IsNotEmpty()
  @Length(10, 10, { message: 'Номер телефону невірний' })
  @IsPhoneNumber('UA', { message: 'Номер телефону невірний' })
  phoneNumber: string;

  @IsOptional()
  storeName?: string;

  @IsNotEmpty()
  @IsUrl(
    {},
    {
      message:
        'Невірний формат посилання на веб-сайт чи профіль у соціальній мережі',
    },
  )
  website: string;

  @IsOptional()
  bio?: string = '';
}
