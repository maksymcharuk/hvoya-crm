import { Injectable } from '@angular/core';
import { Cart, CartItem } from '@shared/interfaces/cart.interface';
import {
  BehaviorSubject,
  delay,
  finalize,
  Observable,
  of,
  shareReplay,
} from 'rxjs';
import * as data from './cart.data';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cart$ = new BehaviorSubject<Cart | null>(null);
  cartLoading$ = new BehaviorSubject<number>(0);
  // TODO: remove this delay
  delay = 2000;

  constructor() {
    this.getCart()
      .pipe(shareReplay())
      .subscribe((cart) => {
        this.cart$.next(cart);
      });
  }

  getCart(): Observable<Cart> {
    // TODO: get cart from backend
    this.cartLoading$.next(this.cartLoading$.getValue() + 1);
    return of(data.default).pipe(
      delay(this.delay),
      finalize(() => this.cartLoading$.next(this.cartLoading$.getValue() - 1)),
    );
  }

  addToCart(cartItem: CartItem): Observable<Cart> {
    // TODO: add to cart on backend
    const cart = this.cart$.getValue();
    const cartItems: CartItem[] = cart?.cartItems
      ? JSON.parse(JSON.stringify(cart?.cartItems))
      : [];

    if (cartItems.length === 0) {
      this.cartLoading$.next(this.cartLoading$.getValue() + 1);
      console.log(this.cartLoading$.getValue());
      const response$ = of({} as Cart).pipe(delay(this.delay));

      response$.subscribe(() => {
        this.cartLoading$.next(this.cartLoading$.getValue() - 1);
        this.cart$.next({
          cartItems: [cartItem],
          total: cartItem.product.price,
        });
      });

      return response$;
    }

    this.cartLoading$.next(this.cartLoading$.getValue() + 1);
    console.log(this.cartLoading$.getValue());

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

    const response$ = of({} as Cart).pipe(delay(this.delay));
    response$.subscribe(() => {
      this.cartLoading$.next(this.cartLoading$.getValue() - 1);
      this.cart$.next({
        cartItems,
        total: cartItems.reduce(
          (acc, item) => acc + item.product.price * item.quantity,
          0,
        ),
      });
    });
    return response$;
  }

  removeFromCart(cartItem: CartItem): Observable<Cart> {
    // TODO: remove from cart on backend
    const cart = this.cart$.getValue();
    const cartItems: CartItem[] = cart?.cartItems
      ? JSON.parse(JSON.stringify(cart?.cartItems))
      : [];

    if (cartItems.length === 0) {
      return of({} as Cart);
    }

    const index = cartItems.findIndex(
      (item: CartItem) => item.product.id === cartItem.product.id,
    );

    if (index !== -1) {
      cartItems.splice(index, 1);
    }

    this.cartLoading$.next(this.cartLoading$.getValue() + 1);

    const response$ = of({} as Cart).pipe(delay(this.delay));
    response$.subscribe(() => {
      this.cartLoading$.next(this.cartLoading$.getValue() - 1);
      this.cart$.next({
        cartItems,
        total: cartItems.reduce(
          (acc, item) => acc + item.product.price * item.quantity,
          0,
        ),
      });
    });
    return response$;
  }
}
