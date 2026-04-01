import { MessageService } from 'primeng/api';

import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {
  ProductBase,
  ProductVariant,
} from '@shared/interfaces/entities/product.entity';

@Component({
  standalone: false,
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

  variants: ProductVariant[] = [];
  selectedVariant: ProductVariant | undefined;
  readonly galleryResponsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 4,
    },
    {
      breakpoint: '768px',
      numVisible: 3,
    },
    {
      breakpoint: '560px',
      numVisible: 2,
    },
  ];

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
