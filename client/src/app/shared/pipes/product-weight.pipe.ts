import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'productWeight' })
export class ProductWeight implements PipeTransform {
  transform(value: number): string {
    return `${value} кг`;
  }
}
