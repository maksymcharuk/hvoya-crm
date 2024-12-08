import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { EditorModule } from 'primeng/editor';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TabViewModule } from 'primeng/tabview';
import { TooltipModule } from 'primeng/tooltip';

import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@shared/shared.module';

import { AdminProductsRoutingModule } from './admin-products-routing.module';
import { AdminProductsComponent } from './admin-products.component';
import { ProductStateChangesComponent } from './components/product-state-changes/product-state-changes.component';
import { UpsertProductFormComponent } from './components/upsert-product-form/upsert-product-form.component';
import { AdminProductBaseListComponent } from './pages/admin-product-base-list/admin-product-base-list.component';
import { AdminProductListComponent } from './pages/admin-product-list/admin-product-list.component';
import { CreateProductComponent } from './pages/create-product/create-product.component';
import { EditProductComponent } from './pages/edit-product/edit-product.component';
import { TransferComponent } from './pages/transfer/transfer.component';
import { ViewProductComponent } from './pages/view-product/view-product.component';

@NgModule({ declarations: [
        AdminProductsComponent,
        AdminProductListComponent,
        CreateProductComponent,
        EditProductComponent,
        ProductStateChangesComponent,
        UpsertProductFormComponent,
        ViewProductComponent,
        TransferComponent,
        AdminProductBaseListComponent,
    ], imports: [CommonModule,
        AdminProductsRoutingModule,
        SharedModule,
        TabViewModule,
        ButtonModule,
        InputTextModule,
        ReactiveFormsModule,
        DropdownModule,
        InputTextareaModule,
        FileUploadModule,
        InputNumberModule,
        EditorModule,
        TooltipModule,
        SelectButtonModule,
        CheckboxModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AdminProductsModule {}
