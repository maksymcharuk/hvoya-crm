import { MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { BehaviorSubject, finalize } from 'rxjs';

import { Component, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { UpdateWaybillFormGroup } from '@shared/interfaces/dto/update-waybill.dto';
import { GetOrderResponse } from '@shared/interfaces/responses/get-order.response';
import { UpdateWaybillResponse } from '@shared/interfaces/responses/update-waybill.response';
import { OrdersService } from '@shared/services/orders.service';

@Component({
  selector: 'app-order-view',
  templateUrl: './order-view.component.html',
  styleUrls: ['./order-view.component.scss'],
})
export class OrderViewComponent {
  @ViewChild('waybillUpload') waybillUpload!: FileUpload;

  order$ = new BehaviorSubject<GetOrderResponse | null>(null);
  waybillSubmitting$ = new BehaviorSubject<boolean>(false);

  updateWaybillForm = this.formBuilder.group({
    trackingId: ['', Validators.required],
    waybill: [''],
  }) as UpdateWaybillFormGroup;

  get waybillControl(): AbstractControl {
    return this.updateWaybillForm.controls.waybill;
  }

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private ordersService: OrdersService,
    private messageService: MessageService,
  ) {
    this.ordersService
      .getOrder(this.route.snapshot.params['id'])
      .subscribe((order) => {
        this.order$.next(order);
      });
    this.order$.subscribe((order) => {
      if (!order) {
        return;
      }
      this.updateWaybillForm.patchValue({
        trackingId: order.delivery.trackingId,
      });
    });

    this.waybillSubmitting$.subscribe((submitting) => {
      submitting
        ? this.updateWaybillForm.disable()
        : this.updateWaybillForm.enable();
    });
  }

  onFileUpload(event: any) {
    this.waybillControl.patchValue(event.files[0]);
  }

  updateWaybill() {
    if (!this.updateWaybillForm.valid) {
      this.updateWaybillForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();

    formData.append(
      'trackingId',
      this.updateWaybillForm.get('trackingId')?.value,
    );
    formData.append('waybill', this.updateWaybillForm.get('waybill')?.value);

    this.waybillSubmitting$.next(true);
    this.ordersService
      .updateWaybill(this.route.snapshot.params['id'], formData)
      .pipe(finalize(() => this.waybillSubmitting$.next(false)))
      .subscribe((order: UpdateWaybillResponse) => {
        this.order$.next(order);
        this.waybillUpload.clear();
        this.waybillControl.reset();
        this.messageService.add({
          severity: 'success',
          detail: 'ТТП успішно оновлено',
        });
      });
  }
}
