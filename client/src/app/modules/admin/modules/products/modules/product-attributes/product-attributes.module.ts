import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '@shared/shared.module';

import { ProductColorsComponent } from './pages/product-colors/product-colors.component';
import { ProductAttributesRoutingModule } from './product-attributes-routing.module';
import { ProductAttributesComponent } from './product-attributes.component';

@NgModule({
  declarations: [ProductAttributesComponent, ProductColorsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ProductAttributesRoutingModule,
    SharedModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    TableModule,
    ToastModule,
    ToolbarModule,
  ],
})
export class ProductAttributesModule {}
