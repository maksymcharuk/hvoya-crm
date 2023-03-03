import { Galleria } from 'primeng/galleria';

import { Location } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

import {
  ProductBase,
  ProductProperties,
  ProductVariant,
} from '@shared/interfaces/products';

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.scss'],
})
export class ProductViewComponent implements OnInit {
  @Input() product!: Partial<ProductBase>;
  @Input() selectedVariantId!: number;
  @Input() hideAddToCartButton = false;
  @Input() previewImages: string[] = [];

  @Output() addToCart = new EventEmitter<ProductVariant>();
  @ViewChild('galleria') galleria!: Galleria;

  variants: ProductVariant[] = [];
  selectedVariant: ProductVariant | undefined;

  sizes: { code: string }[] = [];
  selectedSize = '';

  colors: { code: string }[] = [];
  selectedColor = '';

  constructor(private location: Location) {}

  ngOnInit(): void {
    this.variants = this.product.variants || [];
    this.selectedVariant = this.variants.find(
      (variant) => variant.id === this.selectedVariantId,
    );
    this.sizes = this.getUniqueArray(this.variants, 'size').map((size) => ({
      code: size,
    }));
    this.selectedSize = this.selectedVariant?.properties.size || '';

    this.updateColors();
  }

  onAddToCart(): void {
    if (!this.selectedVariant) {
      return;
    }
    this.addToCart.emit(this.selectedVariant);
  }

  onVariantChange({ value }: any, type: 'color' | 'size'): void {
    const selectedSize = type === 'size' ? value : this.selectedSize;
    const selectedColor = type === 'color' ? value : this.selectedColor;

    this.galleria.activeIndex = 0;
    this.galleria.numVisible = 3;

    this.selectedVariant = this.variants.find(
      (variant) =>
        variant.properties.size === selectedSize &&
        variant.properties.color === selectedColor,
    );

    if (!this.selectedVariant) {
      this.selectedVariant = this.variants.find(
        (variant) => variant.properties.size === selectedSize,
      );
    }

    this.updateColors();

    this.location.replaceState(
      `/${this.location.path().split('/')[1]}/products/${this.product.id}/${
        this.selectedVariant?.id
      }`,
    );
  }

  private updateColors(): void {
    this.colors = this.variants
      .filter((variant) => variant.properties.size === this.selectedSize)
      .map((color) => ({ code: color.properties.color }));
    this.selectedColor = this.selectedVariant?.properties.color || '';
  }

  private getUniqueArray(
    arr: ProductVariant[],
    key: keyof ProductProperties,
  ): any[] {
    return Array.from(new Set(arr.map((item) => item.properties[key])));
  }
}
