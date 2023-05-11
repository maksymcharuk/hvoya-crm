import { IsNotEmpty, IsString } from 'class-validator';

export class RemoveFromCartDto {
  @IsString()
  @IsNotEmpty()
  productId: string;
}
