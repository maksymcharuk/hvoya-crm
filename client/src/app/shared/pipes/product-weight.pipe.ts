import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: false, name: 'productWeight' })
export class ProductWeightPipe implements PipeTransform {
  transform(value?: number | null): string {
    if (!value) {
      return '';
    }
    return `${parseFloat(value.toString()).toFixed(2)} кг`;
  }
}
