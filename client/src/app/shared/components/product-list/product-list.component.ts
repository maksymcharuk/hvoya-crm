import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductBase, ProductVariant } from '@shared/interfaces/products';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent {
  @Input() productList: ProductBase[] = [];
  @Input() isLoading = true;
  @Input() hideAddToCartButton = false;

  @Output() addToCart = new EventEmitter<ProductVariant>();

  onAddToCart(productVariant: ProductVariant) {
    this.addToCart.emit(productVariant);
  }
}
