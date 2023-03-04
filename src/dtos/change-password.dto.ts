import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty({ message: 'Потрібен поточний пароль' })
  currentPassword: string;

  @IsString()
  @MinLength(8, { message: 'Пароль має бути не менше 8 символів' })
  @IsNotEmpty({ message: 'Необхідно ввести пароль' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Потрібно підтвердити пароль' })
  confirmPassword: string;
}
