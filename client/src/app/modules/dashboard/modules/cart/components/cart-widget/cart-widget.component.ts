import { Component } from '@angular/core';

import { CartService } from '../../services/cart/cart.service';

@Component({
  selector: 'app-cart-widget',
  templateUrl: './cart-widget.component.html',
  styleUrls: ['./cart-widget.component.scss'],
})
export class CartWidgetComponent {
  cart$ = this.cartService.cart$;
  cartLoading$ = this.cartService.cartLoading$;
  cartNotEmpty$ = this.cartService.cartNotEmpty$;

  constructor(private cartService: CartService) {
    this.cart$.subscribe(console.log);
  }
}
