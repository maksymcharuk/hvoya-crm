import { IsOptional, IsString } from 'class-validator';

export class UpdateUserByAdminDto {
  @IsString()
  @IsOptional()
  note?: string = '';
}
