import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsOptional()
  firtName?: string;

  @IsOptional()
  lastName?: string;

  @IsNotEmpty()
  password: string;
}
