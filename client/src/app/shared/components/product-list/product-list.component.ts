import { Component, Input } from '@angular/core';
import { ProductBase } from '@shared/interfaces/products';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent {
  @Input() productList: ProductBase[] = [];
  @Input() isLoading = true;
}
