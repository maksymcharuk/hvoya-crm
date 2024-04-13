import { MessageService } from 'primeng/api';
import { Subject, combineLatest, map, switchMap, take, takeUntil } from 'rxjs';

import { Component, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CartItem } from '@shared/interfaces/entities/cart.entity';
import { ProductVariant } from '@shared/interfaces/entities/product.entity';
import { ProductsService } from '@shared/services/products.service';

import { CartService } from '../../../modules/dashboard/modules/cart/services/cart/cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnDestroy {
  @Input() hideAddToCartButton = false;

  private readonly destroyed$ = new Subject<void>();

  products$ = this.route.params.pipe(
    takeUntil(this.destroyed$),
    switchMap((params) => this.productsService.getProduct(params['baseId'])),
    map((product) => product.variants || []),
  );

  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService,
    private cartService: CartService,
    private productsService: ProductsService,
  ) {}

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  onAddToCart(productVariant: ProductVariant) {
    combineLatest([this.cartService.cart$])
      .pipe(
        take(1),
        switchMap(([cart]) => {
          const selectedVariantCount = cart?.items.find(
            (item: CartItem) => item.product.id === productVariant.id,
          )?.quantity;
          if (!productVariant) {
            this.messageService.add({
              severity: 'error',
              detail: `Can't add to cart`,
            });
            throw new Error("Can't add to cart");
          }
          return this.cartService.addToCart({
            productId: productVariant.id,
            quantity: selectedVariantCount ? selectedVariantCount + 1 : 1,
          });
        }),
      )
      .subscribe(() => {
        this.messageService.add({
          severity: 'success',
          detail: `${productVariant.properties.name} додано в кошик`,
        });
      });
  }
}
