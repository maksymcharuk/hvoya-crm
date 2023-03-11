import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';

import {
  ProductBase,
  ProductColor,
  ProductProperties,
  ProductVariant,
} from '@shared/interfaces/products';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss'],
})
export class ProductItemComponent implements OnInit, OnChanges {
  @Input() product!: Partial<ProductBase>;
  @Input() hideAddToCartButton = false;
  @Input() previewImages: string[] = [];

  @Output() addToCart = new EventEmitter<ProductVariant>();

  variants: ProductVariant[] = [];
  selectedVariant: ProductVariant | undefined;

  sizes: { code: string }[] = [];
  selectedSize = '';

  colors: ProductColor[] = [];
  selectedColorId: number | undefined;

  selectedImage = '';

  ngOnInit(): void {
    this.variants = this.product.variants || [];
    this.selectedVariant = this.variants[0];
    this.sizes = this.getUniqueArray(this.variants, 'size').map((size) => ({
      code: size,
    }));
    this.selectedSize = this.sizes[0]?.code || '';
    this.selectedImage = this.selectedVariant?.properties?.images[0]?.url || '';

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
    const selectedSize = type === 'size' ? value : this.selectedSize;
    const selectedColorId = type === 'color' ? value : this.selectedColorId;

    this.selectedVariant = this.variants.find(
      (variant) =>
        variant.properties.size === selectedSize &&
        variant.properties.color.id === selectedColorId,
    );

    if (!this.selectedVariant) {
      this.selectedVariant = this.variants.find(
        (variant) => variant.properties.size === selectedSize,
      );
    }

    this.updateColors();
    this.selectedImage = this.selectedVariant?.properties?.images[0]?.url || '';
  }

  private updateColors(): void {
    this.colors = this.variants
      .filter((variant) => variant.properties.size === this.selectedSize)
      .map((product) => product.properties.color);
    this.selectedColorId = this.selectedVariant?.properties.color?.id;
  }

  private getUniqueArray(
    arr: ProductVariant[],
    key: keyof ProductProperties,
  ): any[] {
    return Array.from(new Set(arr.map((item) => item.properties[key])));
  }
}
