import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-widget',
  templateUrl: './cart-widget.component.html',
  styleUrls: ['./cart-widget.component.scss'],
})
export class CartWidgetComponent {
  cart$ = this.cartService.cart$;

  constructor(private cartService: CartService) {}
}
