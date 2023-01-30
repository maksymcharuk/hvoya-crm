import { Injectable } from '@angular/core';
import { Cart } from '@shared/interfaces/cart.interface';
import { BehaviorSubject, delay, Observable, of, shareReplay } from 'rxjs';

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
    return of({
      cartItems: [
        {
          product: {
            id: 1,
            sku: 'CLSK-1',
            name: 'Classic tree1',
            description: 'Classic Christmas tree',
            size: '1.5m',
            color: 'green',
            price: 100,
            availableItemCount: 10,
            imageIds: [],
          },
          quantity: 1,
        },
        {
          product: {
            id: 2,
            sku: 'CLSK-2',
            name: 'Classic tree2',
            description: 'Classic Christmas tree',
            size: '1.2m',
            color: 'white',
            price: 50,
            availableItemCount: 10,
            imageIds: [],
          },
          quantity: 1,
        },
      ],
      total: 150,
    }).pipe(delay(1000));
  }
}
