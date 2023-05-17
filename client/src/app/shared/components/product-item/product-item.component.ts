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
  ProductSize,
  ProductVariant,
} from '@shared/interfaces/entities/product.entity';
import { getUniqueProductSizes } from '@shared/utils';

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

  sizes: ProductSize[] = [];
  selectedSizeId: string | undefined;

  colors: ProductColor[] = [];
  selectedColorId: string | undefined;

  selectedImage = '';

  ngOnInit(): void {
    this.variants = this.product.variants || [];
    this.selectedVariant = this.variants[0];
    this.sizes = getUniqueProductSizes(this.variants).sort(this.sortSizes);
    this.selectedSizeId = this.selectedVariant?.properties.size.id;
    this.selectedImage = this.selectedVariant?.properties?.images[0]?.url || '';

    this.updateColors();
  }

  ngOnChanges(changes: any): void {
    if (changes.product) {
      this.variants = changes.product.currentValue.variants;
      this.selectedVariant = changes.product.currentValue.variants[0];
      this.sizes = getUniqueProductSizes(this.variants).sort(this.sortSizes);
      this.selectedSizeId = this.sizes[0]?.id;

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
    const selectedSizeId = type === 'size' ? value : this.selectedSizeId;
    const selectedColorId = type === 'color' ? value : this.selectedColorId;

    this.selectedVariant = this.variants.find(
      (variant) =>
        variant.properties.size.id === selectedSizeId &&
        variant.properties.color.id === selectedColorId,
    );

    if (!this.selectedVariant) {
      this.selectedVariant = this.variants.find(
        (variant) => variant.properties.size.id === selectedSizeId,
      );
    }

    this.updateColors();
    this.selectedImage = this.selectedVariant?.properties?.images[0]?.url || '';
  }

  private updateColors(): void {
    this.colors = this.variants
      .filter((variant) => variant.properties.size.id === this.selectedSizeId)
      .map((product) => product.properties.color);
    this.selectedColorId = this.selectedVariant?.properties.color?.id;
  }

  private sortSizes(a: ProductSize, b: ProductSize): number {
    if (a.height || b.height) {
      return a.height - b.height;
    } else if (a.diameter || b.diameter) {
      return a.diameter - b.diameter;
    }
    return 0;
  }
}
