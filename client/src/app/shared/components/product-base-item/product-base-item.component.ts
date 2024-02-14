import { Component, Input, OnChanges, OnInit } from '@angular/core';

import {
  ProductBase,
  ProductVariant,
} from '@shared/interfaces/entities/product.entity';

@Component({
  selector: 'app-product-base-item',
  templateUrl: './product-base-item.component.html',
  styleUrls: ['./product-base-item.component.scss'],
})
export class ProductBaseItemComponent implements OnInit, OnChanges {
  @Input() product!: Partial<ProductBase>;

  variants: ProductVariant[] = [];
  primaryImageUrl = '';

  ngOnInit(): void {
    this.variants = this.product.variants || [];
    this.primaryImageUrl = this.variants[0]?.properties?.images[0]?.url || '';
  }

  ngOnChanges(changes: any): void {
    if (changes.product) {
      this.variants = changes.product.currentValue.variants;
    }
  }
}
