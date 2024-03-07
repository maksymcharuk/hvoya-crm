import { MessageService } from 'primeng/api';
import { Observable, combineLatest, switchMap, take } from 'rxjs';

import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CartItem } from '@shared/interfaces/entities/cart.entity';
import {
  ProductBase,
  ProductVariant,
} from '@shared/interfaces/entities/product.entity';
import { ProductsService } from '@shared/services/products.service';

import { CartService } from '../../../cart/services/cart/cart.service';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.scss'],
})
export class ViewProductComponent {
  product$!: Observable<ProductBase>;
  selectedVariantId!: string;

  constructor(
    private productsService: ProductsService,
    private cartService: CartService,
    private messageService: MessageService,
    private route: ActivatedRoute,
  ) {
    this.route.params.subscribe((params) => {
      this.selectedVariantId = params['variantId'];
      this.product$ = this.productsService.getProduct(params['baseId']);

      console.log('=== ViewProductComponent ===');
      console.log("params['variantId']", params['variantId']);
      console.log("params['baseId']", params['baseId']);
      console.log('============================');
    });
  }

  addToCart(productVariant: ProductVariant) {
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
          detail: `${productVariant.properties.name} додано у кошик`,
        });
      });
  }
}
