import { BehaviorSubject, Observable, map, shareReplay } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@environment/environment';
import { Cart } from '@shared/interfaces/cart.interface';
import { AddToCartDTO } from '@shared/interfaces/dto/add-to-cart.dto';
import { RemoveFromCartDTO } from '@shared/interfaces/dto/remove-from-cart.dto';
import { AddToCartResponse } from '@shared/interfaces/responses/add-to-cart.response';
import { GetCartResponse } from '@shared/interfaces/responses/get-cart.response';
import { RemoveFromCartResponse } from '@shared/interfaces/responses/remove-from-cart.response';

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
    this.getCart().subscribe((cart) => {
      this.cart$.next(cart);
    });
  }

  getCart(): Observable<GetCartResponse> {
    this.incrementCartLoading();
    const response$ = this.http
      .get<GetCartResponse>(`${environment.apiUrl}/cart`)
      .pipe(shareReplay());
    response$.subscribe(() => {
      this.decrementCartLoading();
    });
    return response$;
  }

  addToCart(addToCartDTO: AddToCartDTO): Observable<AddToCartResponse> {
    this.incrementCartLoading();
    const response$ = this.http
      .post<AddToCartResponse>(`${environment.apiUrl}/cart/add`, addToCartDTO)
      .pipe(shareReplay());
    response$.subscribe((cart) => {
      this.cart$.next(cart);
      this.decrementCartLoading();
    });
    return response$;
  }

  removeFromCart(
    removeFromCartDTO: RemoveFromCartDTO,
  ): Observable<RemoveFromCartResponse> {
    this.incrementCartLoading();
    const response$ = this.http
      .post<Cart>(`${environment.apiUrl}/cart/remove`, removeFromCartDTO)
      .pipe(shareReplay());
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
