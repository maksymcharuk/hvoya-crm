import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProductColorDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  hex: string;
}
