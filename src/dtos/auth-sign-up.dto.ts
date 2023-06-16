import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export class AuthSignUpDto {
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
}
