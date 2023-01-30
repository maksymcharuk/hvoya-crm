import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SkeletonModule } from 'primeng/skeleton';
import { ButtonModule } from 'primeng/button';

import { CartWidgetComponent } from './components/cart-widget/cart-widget.component';

@NgModule({
  declarations: [CartWidgetComponent],
  imports: [CommonModule, SkeletonModule, ButtonModule],
  exports: [CartWidgetComponent],
})
export class CartModule {}
