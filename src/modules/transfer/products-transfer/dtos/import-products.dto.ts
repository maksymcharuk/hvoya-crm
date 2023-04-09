import { IsEnum, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

import { ProductsImportSource } from '../enums/product-import-source.enum';

export class ImportProductsDto {
  @IsNotEmpty()
  @IsEnum(ProductsImportSource, {
    message: 'Джерело імпорту має бути коректним "Prom" і тд.',
  })
  source: ProductsImportSource;

  @IsOptional()
  @IsUrl(undefined, { message: 'Посилання повинне бути коректною URL-адресою' })
  link?: string;
}
