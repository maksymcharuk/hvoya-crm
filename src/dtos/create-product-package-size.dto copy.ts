import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateProductPackageSizeDto {
  @IsNumber(undefined, { message: 'Висота упаковки повинна бути числом' })
  @IsNotEmpty({ message: 'Необхідно вказати висоту упаковки' })
  height: number;

  @IsNumber(undefined, { message: 'Ширина паковки повинна бути числом' })
  @IsNotEmpty({ message: 'Необхідно вказати ширину упаковки' })
  width: number;

  @IsNumber(undefined, { message: 'Глибина упаковки повинна бути числом' })
  @IsNotEmpty({ message: 'Необхідно вказати глибину упаковки' })
  depth: number;
}
