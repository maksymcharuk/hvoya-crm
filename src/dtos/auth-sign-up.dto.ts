import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthSignUpDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
