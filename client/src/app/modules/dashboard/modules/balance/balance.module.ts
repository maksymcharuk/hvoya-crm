import { SkeletonModule } from 'primeng/skeleton';
import { ButtonModule } from 'primeng/button';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BalanceWidgetComponent } from './components/balance-widget/balance-widget.component';



@NgModule({
  declarations: [
    BalanceWidgetComponent,
  ],
  imports: [
    CommonModule,
    SkeletonModule,
    ButtonModule,
  ],
  exports: [
    BalanceWidgetComponent,
  ]
})
export class BalanceModule { }
