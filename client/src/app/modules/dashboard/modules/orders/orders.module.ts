import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { FileUploadModule } from 'primeng/fileupload';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { MessageModule } from 'primeng/message';
import { ProgressBarModule } from 'primeng/progressbar';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AblePipe } from '@casl/angular';

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
    ProgressBarModule,
    ButtonModule,
    InputNumberModule,
    InputTextModule,
    TextareaModule,
    ButtonModule,
    InputMaskModule,
    FileUploadModule,
    TableModule,
    SelectModule,
    DialogModule,
    SharedModule,
    AblePipe,
    NgxDocViewerModule,
    ConfirmDialogModule,
    MessageModule,
  ],
  providers: [ConfirmationService],
})
export class OrdersModule {}
