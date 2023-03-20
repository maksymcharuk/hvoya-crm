import { Pipe, PipeTransform } from '@angular/core';

import { ProductSize } from '@shared/interfaces/entities/product.entity';

@Pipe({ name: 'productSize' })
export class ProductSizePipe implements PipeTransform {
  transform(value: ProductSize, mode?: 'short' | undefined): string {
    if (value.diameter) {
      return mode === 'short'
        ? `${value.diameter} см`
        : `${value.diameter}x${value.height} см`;
    } else {
      return mode === 'short'
        ? `${value.height} см`
        : `${value.height}x${value.width}x${value.depth} см`;
    }
  }
}
