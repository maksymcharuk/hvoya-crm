import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { SkeletonModule } from 'primeng/skeleton';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CartRoutingModule } from './cart-routing.module';
import { CartItemComponent } from './components/cart-item/cart-item.component';
import { CartWidgetComponent } from './components/cart-widget/cart-widget.component';
import { CartComponent } from './pages/cart/cart.component';

@NgModule({
  declarations: [CartWidgetComponent, CartComponent, CartItemComponent],
  imports: [
    CommonModule,
    CartRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SkeletonModule,
    ButtonModule,
    InputNumberModule,
  ],
  exports: [CartWidgetComponent],
})
export class CartModule {}
