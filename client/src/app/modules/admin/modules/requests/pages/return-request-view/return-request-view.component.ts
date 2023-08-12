import { MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { BehaviorSubject } from 'rxjs';

import { Component, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
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
    approvedItems: this.formBuilder.array<RequestItemUIEntity>([]),
    managerComment: '',
    deduction: 0,
  });

  get managerComment(): AbstractControl {
    return this.returnRequestForm.get('managerComment')!;
  }

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
    this.managerComment.clearValidators();
    this.managerComment.updateValueAndValidity();

    if (this.returnRequestForm.invalid) {
      this.returnRequestForm.markAllAsTouched();
      return;
    }

    this.requestsService
      .approveRequest(
        {
          approvedItems: this.returnRequestForm.value
            .approvedItems as RequestItemUIEntity[],
          managerComment: this.returnRequestForm.value.managerComment!,
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
    this.managerComment.setValidators([Validators.required]);
    this.managerComment.updateValueAndValidity();

    if (this.returnRequestForm.invalid) {
      this.returnRequestForm.markAllAsTouched();
      return;
    }

    this.requestsService
      .rejectRequest(
        {
          managerComment: this.returnRequestForm.value.managerComment!,
        },
        this.requestNumber,
      )
      .subscribe((request) => {
        this.request$.next(request);
        this.messageService.add({
          severity: 'success',
          summary: 'Запит відхилено',
          detail: 'Запит успішно відхилено',
        });
      });
  }
}
