import { IsNotEmpty, IsNumberString, ValidateIf } from 'class-validator';

export class UpdateProductDto {
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
  productVariantId: number;

  @IsNotEmpty()
  productVariantSku: string;

  @IsNotEmpty()
  productVariantName: string;

  @IsNotEmpty()
  productVariantDescription: string;

  @IsNumberString()
  productVariantWeight: number;

  @IsNotEmpty()
  productVariantSizeId: number;

  @IsNotEmpty()
  productVariantColorId: number;

  @IsNotEmpty()
  productVariantPrice: number;

  @IsNotEmpty()
  existingImages: string;
}
