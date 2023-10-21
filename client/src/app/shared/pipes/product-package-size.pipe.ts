import { Pipe, PipeTransform } from '@angular/core';

import { ProductPackageSize } from '@shared/interfaces/entities/product.entity';

@Pipe({ name: 'productPackageSize' })
export class ProductPackageSizePipe implements PipeTransform {
  transform(value?: ProductPackageSize | null): string {
    if (!value) {
      return '';
    }
    return `${value.height}x${value.width}x${value.depth} см`;
  }
}
