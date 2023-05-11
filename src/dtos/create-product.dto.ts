import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  Min,
  ValidateIf,
} from 'class-validator';

export class CreateProductDto {
  @ValidateIf((o) => !o.productCategoryName)
  @IsNotEmpty()
  productCategoryId: string;

  @ValidateIf((o) => !o.productCategoryId)
  @IsNotEmpty()
  productCategoryName: string;

  @ValidateIf((o) => !o.productBaseName)
  @IsNotEmpty()
  productBaseId: string;

  @ValidateIf((o) => !o.productBaseId)
  @IsNotEmpty()
  productBaseName: string;

  @IsNotEmpty()
  productVariantSku: string;

  @IsNotEmpty()
  productVariantName: string;

  @IsNotEmpty()
  productVariantDescription: string;

  @Transform(({ value }) => (value ? parseInt(value) : value))
  @IsOptional()
  @Min(0)
  productVariantStock: number;

  @IsNumberString()
  productVariantWeight: number;

  @IsNotEmpty()
  productVariantIsPublished: boolean;

  @IsNotEmpty()
  productVariantSizeId: string;

  @IsNotEmpty()
  productVariantColorId: string;

  @IsNotEmpty()
  productVariantPrice: number;
}
