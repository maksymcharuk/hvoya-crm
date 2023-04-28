import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthSignInDto {
  @IsEmail({}, { message: 'Невірний формат електронної пошти' })
  @IsNotEmpty({ message: 'Потрібно ввести електронну пошту' })
  email: string;

  @IsNotEmpty({ message: 'Потрібно ввести пароль' })
  password: string;
}
