import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthSignInDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
