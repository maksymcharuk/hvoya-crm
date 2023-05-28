import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { SkeletonModule } from 'primeng/skeleton';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@shared/shared.module';

import { CartRoutingModule } from './cart-routing.module';
import { CartItemComponent } from './components/cart-item/cart-item.component';
import { CartWidgetComponent } from './components/cart-widget/cart-widget.component';
import { CartComponent } from './pages/cart/cart.component';
import { CartWidgetItemComponent } from './components/cart-widget-item/cart-widget-item.component';

@NgModule({
  declarations: [CartWidgetComponent, CartComponent, CartItemComponent, CartWidgetItemComponent],
  imports: [
    CommonModule,
    CartRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    SkeletonModule,
    ButtonModule,
    InputNumberModule,
  ],
  exports: [CartWidgetComponent],
})
export class CartModule {}
