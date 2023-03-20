import { MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { BehaviorSubject, finalize } from 'rxjs';

import { Component, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { OrderStatus } from '@shared/enums/order-status.enum';
import { OrderUpdateFormGroup } from '@shared/interfaces/dto/update-order.dto copy';
import { UpdateWaybillFormGroup } from '@shared/interfaces/dto/update-waybill.dto';
import { Order } from '@shared/interfaces/entities/order.entity';
import { OrdersService } from '@shared/services/orders.service';

@Component({
  selector: 'app-order-view',
  templateUrl: './order-view.component.html',
  styleUrls: ['./order-view.component.scss'],
})
export class OrderViewComponent {
  @ViewChild('waybillUpload') waybillUpload!: FileUpload;

  order$ = new BehaviorSubject<Order | null>(null);
  waybillSubmitting$ = new BehaviorSubject<boolean>(false);
  statusSubmitting$ = new BehaviorSubject<boolean>(false);
  statusEdit = false;
  orderStatuses = Object.entries(OrderStatus).map(([key, value]) => ({
    label: key,
    value,
  }));

  updateWaybillForm = this.formBuilder.group({
    trackingId: ['', Validators.required],
    waybill: [''],
  }) as UpdateWaybillFormGroup;

  updateOrderStatusForm = this.formBuilder.group({
    orderStatus: ['', Validators.required],
  }) as OrderUpdateFormGroup;

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
      this.updateOrderStatusForm.patchValue({
        orderStatus: order.status,
      });
    });

    this.waybillSubmitting$.subscribe((submitting) => {
      submitting
        ? this.updateWaybillForm.disable()
        : this.updateWaybillForm.enable();
    });

    this.statusSubmitting$.subscribe((submitting) => {
      submitting
        ? this.updateOrderStatusForm.disable()
        : this.updateOrderStatusForm.enable();
    });
  }

  onFileUpload(event: any) {
    this.waybillControl.patchValue(event.files[0]);
  }

  updateStatus() {
    const formData = new FormData();
    formData.append(
      'orderStatus',
      this.updateOrderStatusForm.get('orderStatus')?.value,
    );

    this.statusSubmitting$.next(true);
    this.ordersService
      .orderUpdate(this.route.snapshot.params['id'], formData)
      .pipe(finalize(() => this.statusSubmitting$.next(false)))
      .subscribe((order: Order) => {
        this.order$.next(order);
        this.statusEdit = false;
        this.messageService.add({
          severity: 'success',
          detail: 'Статус замовлення успішно оновлено',
        });
      });
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
      .subscribe((order: Order) => {
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
