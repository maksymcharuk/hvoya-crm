import { IsNotEmpty, IsPhoneNumber, IsString, Length } from 'class-validator';

export class AuthAdminSignUpDto {
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

  @IsNotEmpty({ message: 'Відсутній токен запрошення' })
  @IsString()
  token: string;
}
