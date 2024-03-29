import { Component } from '@angular/core';

import { CartItem } from '@shared/interfaces/entities/cart.entity';

import { CartService } from '../../services/cart/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent {
  cart$ = this.cartService.cart$;
  cartLoading$ = this.cartService.cartLoading$;
  cartNotEmpty$ = this.cartService.cartNotEmpty$;

  constructor(private cartService: CartService) {}

  identify(_index: number, item: CartItem) {
    return item.product.id;
  }
}
