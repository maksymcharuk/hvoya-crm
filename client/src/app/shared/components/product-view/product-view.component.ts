import { MessageService } from 'primeng/api';
import { Galleria } from 'primeng/galleria';

import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {
  ProductBase,
  ProductColor,
  ProductSize,
  ProductVariant,
} from '@shared/interfaces/entities/product.entity';

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.scss'],
})
export class ProductViewComponent implements OnInit {
  @Input() product!: ProductBase;
  @Input() selectedVariantId!: string;
  @Input() hideAddToCartButton = false;
  @Input() previewImages: string[] = [];

  @Output() addToCart = new EventEmitter<ProductVariant>();
  @ViewChild('galleria') galleria!: Galleria;

  variants: ProductVariant[] = [];
  selectedVariant: ProductVariant | undefined;

  sizes: ProductSize[] = [];
  selectedSizeId: string | undefined;

  colors: ProductColor[] = [];
  selectedColorId: string | undefined;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.variants = this.product.variants || [];
    this.selectedVariant = this.variants.find(
      (variant) => variant.id === this.selectedVariantId,
    );

    if (!this.selectedVariant) {
      this.router.navigate(['../../'], {
        relativeTo: this.route,
      });
      this.messageService.add({
        severity: 'error',
        summary: 'Виникла помилка.',
        detail: 'Товару не знайдено',
      });
    }
  }

  onAddToCart(): void {
    if (!this.selectedVariant) {
      return;
    }
    this.addToCart.emit(this.selectedVariant);
  }
}
