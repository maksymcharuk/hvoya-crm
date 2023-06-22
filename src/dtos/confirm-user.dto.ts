import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmUserDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  managerId: string;
}
