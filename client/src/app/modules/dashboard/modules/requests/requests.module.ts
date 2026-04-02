import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { ButtonModule } from 'primeng/button';
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

import { FundsWithdrawalRequestCreateComponent } from './components/funds-withdrawal-request-create/funds-withdrawal-request-create.component';
import { ReturnRequestCreateComponent } from './components/return-request-create/return-request-create.component';
import { FundsWithdrawalRequestViewComponent } from './pages/funds-withdrawal-request-view/funds-withdrawal-request-view.component';
import { RequestCreateComponent } from './pages/request-create/request-create.component';
import { RequestListComponent } from './pages/request-list/request-list.component';
import { ReturnRequestViewComponent } from './pages/return-request-view/return-request-view.component';
import { RequestsRoutingModule } from './requests-routing.module';

@NgModule({
  declarations: [
    RequestListComponent,
    RequestCreateComponent,
    ReturnRequestCreateComponent,
    ReturnRequestViewComponent,
    FundsWithdrawalRequestCreateComponent,
    FundsWithdrawalRequestViewComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ButtonModule,
    AblePipe,
    RequestsRoutingModule,
    SelectModule,
    FormsModule,
    ReactiveFormsModule,
    InputNumberModule,
    SkeletonModule,
    FileUploadModule,
    InputTextModule,
    TextareaModule,
    NgxDocViewerModule,
    DialogModule,
    ImageModule,
  ],
})
export class RequestsModule {}
