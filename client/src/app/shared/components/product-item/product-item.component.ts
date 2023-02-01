import { Component, Input, OnInit } from '@angular/core';
import { ProductBase, ProductVariant } from '@shared/interfaces/products';
import { CartService } from 'src/app/modules/dashboard/modules/cart/services/cart.service';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss'],
})
export class ProductItemComponent implements OnInit {
  @Input() product!: ProductBase;

  variants: ProductVariant[] = [];
  selectedVariant: ProductVariant | undefined;

  sizes: { code: string }[] = [];
  selectedSize = '';

  colors: { code: string }[] = [];
  selectedColor = '';

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.variants = this.product.variants;
    this.selectedVariant = this.variants[0];
    this.sizes = this.getUniqueArray(this.variants, 'size').map((size) => ({
      code: size,
    }));
    this.selectedSize = this.sizes[0]?.code || '';

    this.updateColors();
  }

  addToCart(): void {
    if (!this.selectedVariant) {
      return;
    }

    this.cartService.addToCart({
      product: this.selectedVariant,
      quantity: 1,
    });
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
