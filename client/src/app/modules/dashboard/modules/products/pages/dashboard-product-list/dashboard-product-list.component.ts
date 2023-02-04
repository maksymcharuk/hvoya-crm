import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { combineLatest, finalize, switchMap, take } from 'rxjs';

import { ProductVariant } from '@shared/interfaces/products';
import { ProductsService } from '@shared/services/products.service';

import { CartService } from '../../../cart/services/cart.service';

@Component({
  selector: 'app-dashboard-product-list',
  templateUrl: './dashboard-product-list.component.html',
  styleUrls: ['./dashboard-product-list.component.scss'],
})
export class DashboardProductListComponent {
  productList$ = this.productsService
    .getProducts()
    .pipe(finalize(() => (this.isLoading = false)));
  isLoading = true;

  constructor(
    private productsService: ProductsService,
    private cartService: CartService,
    private messageService: MessageService,
  ) {}

  onAddToCart(productVariant: ProductVariant) {
    combineLatest([this.cartService.cart$])
      .pipe(
        take(1),
        switchMap(([cart]) => {
          const selectedVariantCount = cart?.items.find(
            (item) => item.product.id === productVariant.id,
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
          detail: `${productVariant.name} added to cart`,
        });
      });
  }
}
