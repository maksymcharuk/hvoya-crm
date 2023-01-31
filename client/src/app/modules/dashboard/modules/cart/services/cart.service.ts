import { Injectable } from '@angular/core';
import { Cart, CartItem } from '@shared/interfaces/cart.interface';
import { BehaviorSubject, delay, Observable, of, shareReplay } from 'rxjs';
import * as data from './cart.data';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cart$ = new BehaviorSubject<Cart | null>(null);

  constructor() {
    this.getCart()
      .pipe(shareReplay())
      .subscribe((cart) => {
        this.cart$.next(cart);
      });
  }

  getCart(): Observable<Cart> {
    // TODO: get cart from backend
    return of(data.default).pipe(delay(1000));
  }

  addToCart(cartItem: CartItem): void {
    const cart = this.cart$.getValue();
    const cartItems: CartItem[] = cart?.cartItems
      ? JSON.parse(JSON.stringify(cart?.cartItems))
      : [];

    if (cartItems.length === 0) {
      of({})
        .pipe(delay(1000))
        .subscribe(() => {
          this.cart$.next({
            cartItems: [cartItem],
            total: cartItem.product.price,
          });
        });
      return;
    }

    let found = false;
    cartItems.forEach((item: CartItem) => {
      if (item.product.id === cartItem.product.id) {
        item.quantity = cartItem.quantity;
        found = true;
      }
    });

    if (found === false) {
      cartItems.push(cartItem);
    }

    of({})
      .pipe(delay(1000))
      .subscribe(() => {
        this.cart$.next({
          cartItems,
          total: cartItems.reduce(
            (acc, item) => acc + item.product.price * item.quantity,
            0,
          ),
        });
      });
  }

  removeFromCart(cartItem: CartItem): void {
    const cart = this.cart$.getValue();
    const cartItems: CartItem[] = cart?.cartItems
      ? JSON.parse(JSON.stringify(cart?.cartItems))
      : [];

    if (cartItems.length === 0) {
      return;
    }

    const index = cartItems.findIndex(
      (item: CartItem) => item.product.id === cartItem.product.id,
    );

    if (index !== -1) {
      cartItems.splice(index, 1);
    }

    of({})
      .pipe(delay(1000))
      .subscribe(() => {
        this.cart$.next({
          cartItems,
          total: cartItems.reduce(
            (acc, item) => acc + item.product.price * item.quantity,
            0,
          ),
        });
      });
  }
}
