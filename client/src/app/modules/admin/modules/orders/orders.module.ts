import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AbilityModule } from '@casl/angular';

import { SharedModule } from '@shared/shared.module';

import { OrdersRoutingModule } from './orders-routing.module';
import { OrderListComponent } from './pages/order-list/order-list.component';
import { OrderViewComponent } from './pages/order-view/order-view.component';

@NgModule({
  declarations: [OrderListComponent, OrderViewComponent],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    InputTextareaModule,
    FileUploadModule,
    DropdownModule,
    DialogModule,
    NgxDocViewerModule,
    AbilityModule,
  ],
})
export class OrdersModule {}
