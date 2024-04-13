import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ProductVariant } from '@shared/interfaces/entities/product.entity';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss'],
})
export class ProductItemComponent implements OnInit {
  @Input() product!: ProductVariant;
  @Input() hideAddToCartButton = false;
  @Input() previewImages: string[] = [];
  @Input() baseProductId = '';

  @Output() addToCart = new EventEmitter<ProductVariant>();

  primaryImageUrl = '';

  ngOnInit(): void {
    this.primaryImageUrl = this.product.properties?.images[0]?.url || '';
  }

  onAddToCart(): void {
    if (!this.product) {
      return;
    }
    this.addToCart.emit(this.product);
  }
}
