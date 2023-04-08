import { IsEnum, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

import { ProductsImportSource } from '../enums/product-import-source.enum';

export class ImportProductsDto {
  @IsNotEmpty()
  @IsEnum(ProductsImportSource)
  source: ProductsImportSource;

  @IsOptional()
  @IsUrl()
  link?: string;
}
