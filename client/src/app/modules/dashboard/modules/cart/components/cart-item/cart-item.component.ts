import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CartItem } from '@shared/interfaces/cart.interface';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.scss'],
})
export class CartItemComponent implements AfterViewInit {
  @Input() cartItem!: CartItem;

  quantityForm = this.fb.group({
    quantity: [1],
  });

  constructor(
    private cartService: CartService,
    private fb: FormBuilder,
    private ref: ChangeDetectorRef,
  ) {
    this.quantityForm.get('quantity')?.valueChanges.subscribe((quantity) => {
      this.cartService.addToCart({
        product: this.cartItem.product,
        quantity: quantity || 1,
      });
    });
  }

  ngAfterViewInit(): void {
    this.quantityForm.get('quantity')?.setValue(this.cartItem.quantity || 1);
    this.ref.detectChanges();
  }

  removeCartItem(): void {
    this.cartService.removeFromCart(this.cartItem);
  }
}
