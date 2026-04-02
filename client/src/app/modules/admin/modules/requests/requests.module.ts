import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { FileUploadModule } from 'primeng/fileupload';
import { ImageModule } from 'primeng/image';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SkeletonModule } from 'primeng/skeleton';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AblePipe } from '@casl/angular';

import { SharedModule } from '@shared/shared.module';

import { FundsWithdrawalRequestViewComponent } from './pages/funds-withdrawal-request-view/funds-withdrawal-request-view.component';
import { RequestListComponent } from './pages/request-list/request-list.component';
import { ReturnRequestViewComponent } from './pages/return-request-view/return-request-view.component';
import { RequestsRoutingModule } from './requests-routing.module';

@NgModule({
  declarations: [
    RequestListComponent,
    ReturnRequestViewComponent,
    FundsWithdrawalRequestViewComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RequestsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDocViewerModule,
    DialogModule,
    ButtonModule,
    SelectModule,
    InputNumberModule,
    SkeletonModule,
    AblePipe,
    TextareaModule,
    ImageModule,
    InputTextModule,
    FileUploadModule,
    ConfirmDialogModule,
  ],
  providers: [ConfirmationService],
})
export class RequestsModule {}
