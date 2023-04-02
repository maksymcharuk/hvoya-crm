import {
  BehaviorSubject,
  Subject,
  catchError,
  debounceTime,
  takeUntil,
} from 'rxjs';

import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { AbstractControl, FormBuilder } from '@angular/forms';

import { CartItem } from '@shared/interfaces/entities/cart.entity';

import { CartService } from '../../../cart/services/cart/cart.service';

@Component({
  selector: 'app-order-cart-item',
  templateUrl: './order-cart-item.component.html',
  styleUrls: ['./order-cart-item.component.scss'],
})
export class OrderCartItemComponent
  implements OnChanges, AfterViewInit, OnDestroy
{
  @Input() cartItem!: CartItem;

  updating$ = new BehaviorSubject<number>(0);
  destroy$ = new Subject();
  hightlight = false;

  quantityForm = this.fb.group({
    quantity: [1],
  });

  get quantityControl(): AbstractControl {
    return this.quantityForm.get('quantity')!;
  }

  constructor(
    private cartService: CartService,
    private fb: FormBuilder,
    private ref: ChangeDetectorRef,
  ) {
    this.quantityControl?.valueChanges
      .pipe(debounceTime(500), takeUntil(this.destroy$))
      .subscribe((quantity) => {
        this.updating$.next(this.updating$.getValue() + 1);
        this.cartService
          .addToCart({
            productId: this.cartItem.product.id,
            quantity: quantity || 1,
          })
          .pipe(
            catchError(() => {
              this.updating$.next(this.updating$.getValue() - 1);
              this.quantityControl.patchValue(this.cartItem.quantity, {
                emitEvent: false,
              });
              return [];
            }),
          )
          .subscribe(() => {
            this.updating$.next(this.updating$.getValue() - 1);
            this.hightlight = false;
          });
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const cartItem = changes['cartItem'];
    if (cartItem && !cartItem?.firstChange) {
      const currentCartItem = cartItem.currentValue as CartItem;

      if (currentCartItem.product.stock < this.quantityControl.value) {
        this.hightlight = true;
      }
    }
  }

  ngAfterViewInit(): void {
    this.quantityControl?.patchValue(this.cartItem.quantity, {
      emitEvent: false,
    });
    this.ref.detectChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  removeCartItem(): void {
    this.cartService.removeFromCart({ productId: this.cartItem.product.id });
  }
}
