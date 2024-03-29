import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MessagesModule } from 'primeng/messages';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AbilityModule } from '@casl/angular';

import { SharedModule } from '@shared/shared.module';

import { OrderCartItemComponent } from './components/order-cart-item/order-cart-item.component';
import { OrdersRoutingModule } from './orders-routing.module';
import { OrderCreateComponent } from './pages/order-create/order-create.component';
import { OrderListComponent } from './pages/order-list/order-list.component';
import { OrderViewComponent } from './pages/order-view/order-view.component';

@NgModule({
  declarations: [
    OrderListComponent,
    OrderCreateComponent,
    OrderCartItemComponent,
    OrderViewComponent,
  ],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SkeletonModule,
    ButtonModule,
    InputNumberModule,
    InputTextModule,
    InputTextareaModule,
    ButtonModule,
    InputMaskModule,
    FileUploadModule,
    TableModule,
    DropdownModule,
    DialogModule,
    SharedModule,
    AbilityModule,
    NgxDocViewerModule,
    ConfirmDialogModule,
    MessagesModule,
  ],
  providers: [ConfirmationService],
})
export class OrdersModule {}
