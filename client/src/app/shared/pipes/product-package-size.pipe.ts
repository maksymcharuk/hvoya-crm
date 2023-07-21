import { Pipe, PipeTransform } from '@angular/core';

import { CreateProductPackageSizeDTO } from '@shared/interfaces/dto/create-product-package-size.dto';

@Pipe({ name: 'productPackageSize' })
export class ProductPackageSize implements PipeTransform {
  transform(value: CreateProductPackageSizeDTO): string {
    return `${value.height}x${value.width}x${value.depth} см`;
  }
}
