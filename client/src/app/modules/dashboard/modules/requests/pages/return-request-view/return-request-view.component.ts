import { MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { BehaviorSubject, finalize } from 'rxjs';

import { Component, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { WAYBILL_ACCEPTABLE_FILE_FORMATS } from '@shared/constants/order.constants';
import { OrderReturnRequestStatus } from '@shared/enums/order-return-request-status.enum';
import { UpdateWaybillFormGroup } from '@shared/interfaces/dto/update-waybill.dto';
import { RequestEntity } from '@shared/interfaces/entities/request.entity';
import { RequestsService } from '@shared/services/requests.service';
import { alphanumeric } from '@shared/validators/alphanumeric.validator';

@Component({
  selector: 'app-return-request-view',
  templateUrl: './return-request-view.component.html',
  styleUrls: ['./return-request-view.component.scss'],
})
export class ReturnRequestViewComponent {
  requestNumber = this.route.snapshot.params['number'];
  request$ = new BehaviorSubject<RequestEntity | null>(null);
  showWaybillViewDialog = false;
  fileFormats = WAYBILL_ACCEPTABLE_FILE_FORMATS;
  waybillSubmitting$ = new BehaviorSubject<boolean>(false);
  returnRequestStatus = OrderReturnRequestStatus;

  updateWaybillForm = this.formBuilder.group({
    trackingId: [
      '',
      [Validators.required, alphanumeric({ allowSpaces: true })],
    ],
    waybill: [''],
  }) as UpdateWaybillFormGroup;

  get waybillControl(): AbstractControl {
    return this.updateWaybillForm.controls.waybill;
  }

  @ViewChild('waybillUpload') waybillUpload!: FileUpload;

  constructor(
    private readonly route: ActivatedRoute,
    private requestsService: RequestsService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
  ) {
    this.requestsService.getRequest(this.requestNumber).subscribe((request) => {
      this.request$.next(request);
      this.updateWaybillForm.patchValue({
        trackingId: request.returnRequest!.delivery.trackingId,
      });
    });

    this.waybillSubmitting$.subscribe((submitting) => {
      submitting
        ? this.updateWaybillForm.disable()
        : this.updateWaybillForm.enable();
    });
  }

  showWaybillViewDialogHandler() {
    this.showWaybillViewDialog = true;
  }

  onWaybillUpload(event: any) {
    this.waybillControl.patchValue(event.files[0]);
  }

  onWaybillRemove() {
    this.waybillControl.patchValue(null);
  }

  updateWaybill() {
    if (!this.updateWaybillForm.valid) {
      this.updateWaybillForm.markAllAsTouched();
      return;
    }

    const formValue = this.updateWaybillForm.value;
    const formData = new FormData();

    const value = {
      returnRequest: {
        trackingId: formValue.trackingId,
      },
      waybill: formValue.waybill,
    };

    formData.append('returnRequest', JSON.stringify(value.returnRequest));
    formData.append('documents', value.waybill!);

    this.waybillSubmitting$.next(true);
    this.requestsService
      .requestUpdateByCustomer(this.route.snapshot.params['number'], formData)
      .pipe(finalize(() => this.waybillSubmitting$.next(false)))
      .subscribe((request: RequestEntity) => {
        this.request$.next(request);
        this.waybillUpload.clear();
        this.waybillControl.reset();
        this.messageService.add({
          severity: 'success',
          detail: 'Дані доставки успішно оновлено',
        });
      });
  }
}
