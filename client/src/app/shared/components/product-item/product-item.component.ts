import { Component } from '@angular/core';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss'],
})
export class ProductItemComponent {
  sizes = [
    { name: '80cm', code: '80' },
    { name: '120cm', code: '120' },
    { name: '160cm', code: '160' },
    { name: '220cm', code: '220' },
  ];
  selectedSize = '80';

  colors = [
    { name: 'White', code: '#EDEEF4' },
    { name: 'Green', code: '#008000' },
    { name: 'Blue', code: '#87e3ef' },
  ];
  selectedColor = '#008000';
}
