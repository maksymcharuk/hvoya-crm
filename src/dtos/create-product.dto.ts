import { IsNotEmpty, ValidateIf } from 'class-validator';

export class CreateProductDto {
  @ValidateIf((o) => !o.productCategoryName)
  @IsNotEmpty()
  productCategoryId: number;

  @ValidateIf((o) => !o.productCategoryId)
  @IsNotEmpty()
  productCategoryName: string;

  @ValidateIf((o) => !o.productBaseName)
  @IsNotEmpty()
  productBaseId: number;

  @ValidateIf((o) => !o.productBaseId)
  @IsNotEmpty()
  productBaseName: string;

  @IsNotEmpty()
  productVariantSku: string;

  @IsNotEmpty()
  productVariantName: string;

  @IsNotEmpty()
  productVariantDescription: string;

  @IsNotEmpty()
  productVariantSizeId: number;

  @IsNotEmpty()
  productVariantColorId: number;

  @IsNotEmpty()
  productVariantPrice: number;
}
