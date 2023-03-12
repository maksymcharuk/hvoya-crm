import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateProductSizeDto {
  @IsNumber(undefined, { message: 'Висота повинна бути числом' })
  @IsNotEmpty({ message: 'Необхідно вказати висоту' })
  height: number;

  @IsNumber(undefined, { message: 'Ширина повинна бути числом' })
  @IsOptional()
  width: number;

  @IsNumber(undefined, { message: 'Глибина повинна бути числом' })
  @IsOptional()
  depth: number;

  @IsNumber(undefined, { message: 'Діаметр повинен бути числом' })
  @IsOptional()
  diameter: number;

  @IsNumber(undefined, { message: 'Висота в упаковці повинна бути числом' })
  @IsNotEmpty({ message: 'Необхідно вказати висоту в упаковці' })
  packageHeight: number;

  @IsNumber(undefined, { message: 'Ширина в упаковці повинна бути числом' })
  @IsNotEmpty({ message: 'Необхідно вказати ширину в упаковці' })
  packageWidth: number;

  @IsNumber(undefined, { message: 'Глибина в упаковці повинна бути числом' })
  @IsNotEmpty({ message: 'Необхідно вказати глибину в упаковці' })
  packageDepth: number;
}
