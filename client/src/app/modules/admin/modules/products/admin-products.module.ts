import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { EditorModule } from 'primeng/editor';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TabViewModule } from 'primeng/tabview';

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@shared/shared.module';

import { AdminProductsRoutingModule } from './admin-products-routing.module';
import { AdminProductsComponent } from './admin-products.component';
import { ProductStateChangesComponent } from './components/product-state-changes/product-state-changes.component';
import { UpsertProductFormComponent } from './components/upsert-product-form/upsert-product-form.component';
import { AdminProductListComponent } from './pages/admin-product-list/admin-product-list.component';
import { CreateProductComponent } from './pages/create-product/create-product.component';
import { EditProductComponent } from './pages/edit-product/edit-product.component';
import { ViewProductComponent } from './pages/view-product/view-product.component';

@NgModule({
  declarations: [
    AdminProductsComponent,
    AdminProductListComponent,
    CreateProductComponent,
    EditProductComponent,
    ProductStateChangesComponent,
    UpsertProductFormComponent,
    ViewProductComponent,
  ],
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
    EditorModule,
  ],
})
export class AdminProductsModule {}
