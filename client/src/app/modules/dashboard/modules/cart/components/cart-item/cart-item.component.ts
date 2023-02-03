import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CartItem } from '@shared/interfaces/cart.interface';
import {
  BehaviorSubject,
  debounceTime,
  finalize,
  Subject,
  takeUntil,
} from 'rxjs';

import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.scss'],
})
export class CartItemComponent implements AfterViewInit, OnDestroy {
  @Input() cartItem!: CartItem;

  updating$ = new BehaviorSubject<number>(0);
  destroy$ = new Subject();

  quantityForm = this.fb.group({
    quantity: [1],
  });

  get quantityControl() {
    return this.quantityForm.get('quantity');
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
            finalize(() => {
              this.updating$.next(this.updating$.getValue() - 1);
            }),
          )
          .subscribe();
      });
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
