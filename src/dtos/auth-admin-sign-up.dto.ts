import { IsNotEmpty, IsPhoneNumber, IsString, Length } from 'class-validator';

import { Cyrillic } from '@root/validators/сyrillic.validator';

export class AuthAdminSignUpDto {
  @IsString()
  @Cyrillic({
    message: "Ім'я повинен містити лише літери українського алфавіту",
  })
  @IsNotEmpty({ message: "Потрібно вказати ім'я" })
  firstName: string;

  @IsString()
  @Cyrillic({
    message: 'Прізвище повинне містити лише літери українського алфавіту',
  })
  @IsNotEmpty({ message: 'Потрібно вказати прізвище' })
  lastName: string;

  @IsString()
  @Cyrillic({
    message: 'По батькові повинне містити лише літери українського алфавіту',
  })
  @IsNotEmpty({ message: 'Потрібно вказати по-батькові' })
  middleName: string;

  @IsNotEmpty({ message: 'Потрібно ввести пароль' })
  password: string;

  @IsNotEmpty()
  @Length(10, 10, { message: 'Номер телефону невірний' })
  @IsPhoneNumber('UA', { message: 'Номер телефону невірний' })
  phoneNumber: string;

  @IsNotEmpty({ message: 'Відсутній токен запрошення' })
  @IsString()
  token: string;
}
