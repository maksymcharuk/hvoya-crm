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
  ProductColor,
  ProductSize,
  ProductVariant,
} from '@shared/interfaces/entities/product.entity';
import { getUniqueProductSizes } from '@shared/utils';

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

  sizes: ProductSize[] = [];
  selectedSizeId: number | undefined;

  colors: ProductColor[] = [];
  selectedColorId: number | undefined;

  constructor(private location: Location) {}

  ngOnInit(): void {
    this.variants = this.product.variants || [];
    this.selectedVariant = this.variants.find(
      (variant) => variant.id === this.selectedVariantId,
    );
    this.sizes = getUniqueProductSizes(this.variants);
    this.selectedSizeId = this.selectedVariant?.properties.size.id;

    this.updateColors();
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

    this.galleria.activeIndex = 0;
    this.galleria.numVisible = 3;

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

    this.location.replaceState(
      `/${this.location.path().split('/')[1]}/products/${this.product.id}/${
        this.selectedVariant?.id
      }`,
    );
  }

  private updateColors(): void {
    this.colors = this.variants
      .filter((variant) => variant.properties.size.id === this.selectedSizeId)
      .map((product) => product.properties.color);
    this.selectedColorId =
      this.selectedVariant?.properties.color.id || undefined;
  }
}
