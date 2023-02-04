import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';

import { ProductBase, ProductVariant } from '@shared/interfaces/products';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss'],
})
export class ProductItemComponent implements OnInit, OnChanges {
  @Input() product!: ProductBase;
  @Input() hideAddToCartButton = false;
  @Input() previewImages: string[] = [];

  @Output() addToCart = new EventEmitter<ProductVariant>();

  variants: ProductVariant[] = [];
  selectedVariant: ProductVariant | undefined;

  sizes: { code: string }[] = [];
  selectedSize = '';

  colors: { code: string }[] = [];
  selectedColor = '';

  selectedImage = '';

  ngOnInit(): void {
    this.variants = this.product.variants;
    this.selectedVariant = this.variants[0];
    this.sizes = this.getUniqueArray(this.variants, 'size').map((size) => ({
      code: size,
    }));
    this.selectedSize = this.sizes[0]?.code || '';
    this.selectedImage = this.selectedVariant?.images[0]?.url || '';

    this.updateColors();
  }

  ngOnChanges(changes: any): void {
    if (changes.product) {
      this.variants = changes.product.currentValue.variants;
      this.selectedVariant = changes.product.currentValue.variants[0];
      this.sizes = this.getUniqueArray(this.variants, 'size').map((size) => ({
        code: size,
      }));
      this.selectedSize = this.sizes[0]?.code || '';

      this.updateColors();
    }

    if (changes.previewImages && changes.previewImages.currentValue) {
      this.selectedImage = changes.previewImages.currentValue[0] || '';
    }
  }

  onAddToCart(): void {
    if (!this.selectedVariant) {
      return;
    }
    this.addToCart.emit(this.selectedVariant);
  }

  onVariantChange({ value }: any, type: 'color' | 'size'): void {
    this.updateColors();

    const selectedSize = type === 'size' ? value : this.selectedSize;
    const selectedColor = type === 'color' ? value : this.selectedColor;

    this.selectedVariant = this.variants.find(
      (variant) =>
        variant.size === selectedSize && variant.color === selectedColor,
    );
  }

  private updateColors(): void {
    this.colors = this.variants
      .filter((variant) => variant.size === this.selectedSize)
      .map((color) => ({ code: color.color }));
    this.selectedColor = this.colors[0]?.code || '';
  }

  private getUniqueArray(arr: any[], key: string): any[] {
    return Array.from(new Set(arr.map((item) => item[key])));
  }
}
