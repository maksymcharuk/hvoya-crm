import { IsNotEmpty, IsNumber } from 'class-validator';

export class RemoveFromCartDto {
  @IsNumber()
  @IsNotEmpty()
  productId: number;
}
