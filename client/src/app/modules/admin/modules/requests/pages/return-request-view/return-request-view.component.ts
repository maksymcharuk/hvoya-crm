import { MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { BehaviorSubject } from 'rxjs';

import { Component, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { RequestEntity } from '@shared/interfaces/entities/request.entity';
import { RequestItemUIEntity } from '@shared/interfaces/ui-entities/request-item.ui-entity';
import { RequestsService } from '@shared/services/requests.service';

@Component({
  selector: 'app-return-request-view',
  templateUrl: './return-request-view.component.html',
  styleUrls: ['./return-request-view.component.scss'],
})
export class ReturnRequestViewComponent {
  requestNumber = this.route.snapshot.params['number'];
  request$ = new BehaviorSubject<RequestEntity | null>(null);
  showWaybillViewDialog = false;

  returnRequestForm = this.formBuilder.group({
    approvedItems: this.formBuilder.array([]),
    deduction: this.formBuilder.control(0),
  });

  get approvedItems(): FormArray<FormControl> {
    return this.returnRequestForm.get(
      'approvedItems',
    ) as FormArray<FormControl>;
  }

  @ViewChild('waybillUpload') waybillUpload!: FileUpload;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly requestsService: RequestsService,
    private readonly formBuilder: FormBuilder,
    private readonly messageService: MessageService,
  ) {
    this.requestsService
      .getRequest(this.requestNumber)
      .subscribe((request: RequestEntity) => {
        this.request$.next(request);
        request.returnRequest!.requestedItems!.forEach((item) => {
          this.approvedItems.push(
            this.formBuilder.control(new RequestItemUIEntity(item)),
          );
        });
      });
  }

  showWaybillViewDialogHandler() {
    this.showWaybillViewDialog = true;
  }

  approveReturnRequest() {
    this.requestsService
      .approveRequest(
        {
          approvedItems: this.returnRequestForm.value
            .approvedItems as RequestItemUIEntity[],
          deduction: this.returnRequestForm.value.deduction!,
        },
        this.requestNumber,
      )
      .subscribe((request) => {
        this.request$.next(request);
        this.messageService.add({
          severity: 'success',
          summary: 'Запит підтверджено',
          detail: 'Запит успішно підтверджено',
        });
      });
  }

  rejectReturnRequest() {
    console.log('rejectReturnRequest');
  }
}
