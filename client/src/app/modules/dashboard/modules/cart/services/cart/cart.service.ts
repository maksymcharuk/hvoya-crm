import { BehaviorSubject, Observable, map, shareReplay } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@environment/environment';
import { AddToCartDTO } from '@shared/interfaces/dto/add-to-cart.dto';
import { RemoveFromCartDTO } from '@shared/interfaces/dto/remove-from-cart.dto';
import { Cart } from '@shared/interfaces/entities/cart.entity';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cart$ = new BehaviorSubject<Cart | null>(null);
  cartLoading$ = new BehaviorSubject<number>(0);
  cartItemsNumber$ = this.cart$.pipe(
    map((cart) => {
      const number = cart?.items.reduce((acc, item) => acc + item.quantity, 0);
      return number && number > 0 ? number : null;
    }),
  );
  cartNotEmpty$ = this.cartItemsNumber$.pipe(
    map((cartItemsNumber) => {
      return cartItemsNumber && cartItemsNumber > 0;
    }),
  );

  constructor(private http: HttpClient) {
    this.getCart().subscribe();
  }

  getCart(): Observable<Cart> {
    this.incrementCartLoading();
    const response$ = this.http.get<Cart>(`${environment.apiUrl}/cart`).pipe(
      shareReplay(),
      map((cart) => new Cart(cart)),
    );
    response$.subscribe((cart) => {
      this.cart$.next(cart);
      this.decrementCartLoading();
    });
    return response$;
  }

  addToCart(addToCartDTO: AddToCartDTO): Observable<Cart> {
    this.incrementCartLoading();
    const response$ = this.http
      .post<Cart>(`${environment.apiUrl}/cart/add`, addToCartDTO)
      .pipe(
        shareReplay(),
        map((cart) => new Cart(cart)),
      );
    response$.subscribe((cart) => {
      this.cart$.next(cart);
      this.decrementCartLoading();
    });
    return response$;
  }

  removeFromCart(removeFromCartDTO: RemoveFromCartDTO): Observable<Cart> {
    this.incrementCartLoading();
    const response$ = this.http
      .post<Cart>(`${environment.apiUrl}/cart/remove`, removeFromCartDTO)
      .pipe(
        shareReplay(),
        map((cart) => new Cart(cart)),
      );
    response$.subscribe((cart) => {
      this.cart$.next(cart);
      this.decrementCartLoading();
    });
    return response$;
  }

  private incrementCartLoading() {
    this.cartLoading$.next(this.cartLoading$.value + 1);
  }

  private decrementCartLoading() {
    this.cartLoading$.next(this.cartLoading$.value - 1);
  }
}
