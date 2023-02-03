import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TabViewModule } from 'primeng/tabview';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FileUploadModule } from 'primeng/fileupload';
import { HttpClientModule } from '@angular/common/http';
import { InputNumberModule } from 'primeng/inputnumber';

import { SharedModule } from '@shared/shared.module';

import { AdminProductsRoutingModule } from './admin-products-routing.module';

import { AdminProductsComponent } from './admin-products.component';
import { AdminProductListComponent } from './pages/admin-product-list/admin-product-list.component';
import { CreateProductComponent } from './pages/create-product/create-product.component';



@NgModule({
  declarations: [AdminProductsComponent, AdminProductListComponent, CreateProductComponent],
  imports: [
    CommonModule,
    AdminProductsRoutingModule,
    SharedModule,
    TabViewModule,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    DropdownModule,
    InputTextareaModule,
    FileUploadModule,
    HttpClientModule,
    InputNumberModule,
  ],
})
export class AdminProductsModule { }