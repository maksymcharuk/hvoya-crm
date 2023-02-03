import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, shareReplay } from 'rxjs';

import { environment } from '@environment/environment';
import { Cart } from '@shared/interfaces/cart.interface';
import { GetCartResponse } from '@shared/interfaces/responses/get-cart.response';
import { AddToCartDTO } from '@shared/interfaces/dto/add-to-cart.dto';
import { AddToCartResponse } from '@shared/interfaces/responses/add-to-cart.response';
import { RemoveFromCartDTO } from '@shared/interfaces/dto/remove-from-cart.dto';
import { RemoveFromCartResponse } from '@shared/interfaces/responses/remove-from-cart.response';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cart$ = new BehaviorSubject<Cart | null>(null);
  cartLoading$ = new BehaviorSubject<number>(0);
  cartNotEmpty$ = this.cart$.pipe(
    map((cart) => {
      const itemsNumber = cart?.items.reduce(
        (acc, item) => acc + item.quantity,
        0,
      );
      return itemsNumber && itemsNumber > 0;
    }),
  );
  cartItemsNumber$ = this.cart$.pipe(
    map((cart) => {
      const number = cart?.items.reduce((acc, item) => acc + item.quantity, 0);
      return number && number > 0 ? number.toString() : null;
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