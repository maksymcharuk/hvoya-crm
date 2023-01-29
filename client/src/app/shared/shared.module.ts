import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { SelectButtonModule } from 'primeng/selectbutton';
import { SkeletonModule } from 'primeng/skeleton';

import { HttpExceptionInterceptor } from './interceptors/http-exception.interceptor';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { VerticalMenuComponent } from './components/vertical-menu/vertical-menu.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductItemComponent } from './components/product-item/product-item.component';

const COMPONENTS = [
  VerticalMenuComponent,
  ProductListComponent,
  ProductItemComponent,
];

const PRIMENG_MODULES = [SelectButtonModule, SkeletonModule];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    ...PRIMENG_MODULES,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpExceptionInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  exports: [...COMPONENTS],
})
export class SharedModule {}
