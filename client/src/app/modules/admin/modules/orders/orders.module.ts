import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { MessageModule } from 'primeng/message';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { TextareaModule } from 'primeng/textarea';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AblePipe } from '@casl/angular';

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
    TextareaModule,
    FileUploadModule,
    SelectModule,
    MessageModule,
    DialogModule,
    NgxDocViewerModule,
    ButtonModule,
    ProgressBarModule,
    AblePipe,
  ],
})
export class OrdersModule {}
