import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SkeletonModule } from 'primeng/skeleton';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';

import { CartRoutingModule } from './cart-routing.module';
import { CartWidgetComponent } from './components/cart-widget/cart-widget.component';
import { CartComponent } from './pages/cart/cart.component';
import { CartItemComponent } from './components/cart-item/cart-item.component';

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
