import { MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import {
  BehaviorSubject,
  Subject,
  debounceTime,
  distinctUntilChanged,
  finalize,
  takeUntil,
} from 'rxjs';

import { Component, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { WAYBILL_ACCEPTABLE_FILE_FORMATS } from '@shared/constants/order.constants';
import { OrderStatus } from '@shared/enums/order-status.enum';
import { Role } from '@shared/enums/role.enum';
import { OrderUpdateFormGroup } from '@shared/interfaces/dto/update-order.dto';
import { UpdateWaybillFormGroup } from '@shared/interfaces/dto/update-waybill.dto';
import { Order } from '@shared/interfaces/entities/order.entity';
import { OrdersService } from '@shared/services/orders.service';
import { alphanumeric } from '@shared/validators/alphanumeric.validator';

@Component({
  selector: 'app-order-view',
  templateUrl: './order-view.component.html',
  styleUrls: ['./order-view.component.scss'],
})
export class OrderViewComponent {
  @ViewChild('waybillUpload') waybillUpload!: FileUpload;

  private readonly destroy$ = new Subject<void>();

  order$ = new BehaviorSubject<Order | null>(null);
  waybillSubmitting$ = new BehaviorSubject<boolean>(false);
  orderStatusEnum = OrderStatus;
  roleEnum = Role;
  fileFormats = WAYBILL_ACCEPTABLE_FILE_FORMATS;
  showWaybillViewDialog = false;
  submitting = false;

  orderNoteForm = this.formBuilder.group({
    customerNote: [''],
  }) as OrderUpdateFormGroup;

  get customerNoteControl(): AbstractControl {
    return this.orderNoteForm.controls.customerNote!;
  }

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

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private ordersService: OrdersService,
    private messageService: MessageService,
  ) {
    this.ordersService
      .getOrder(this.route.snapshot.params['number'])
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
      this.orderNoteForm.patchValue(
        {
          customerNote: order.customerNote,
        },
        {
          emitEvent: false,
        },
      );
    });

    this.waybillSubmitting$.subscribe((submitting) => {
      submitting
        ? this.updateWaybillForm.disable()
        : this.updateWaybillForm.enable();
    });

    this.customerNoteControl.valueChanges
      .pipe(takeUntil(this.destroy$), debounceTime(700), distinctUntilChanged())
      .subscribe((note) => {
        const formData = new FormData();
        formData.append('customerNote', note);
        this.updateOrderNote(formData);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFileUpload(event: any) {
    this.waybillControl.patchValue(event.files[0]);
  }

  showWaybillViewDialogHandler() {
    this.showWaybillViewDialog = true;
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
      .updateByCustomer(this.route.snapshot.params['number'], formData)
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

  updateOrderNote(note: FormData) {
    this.submitting = true;
    this.ordersService
      .updateByCustomer(this.route.snapshot.params['number'], note)
      .pipe(finalize(() => (this.submitting = false)))
      .subscribe((order: Order) => {
        this.order$.next(order);
        this.messageService.add({
          severity: 'success',
          detail: 'Коментар успішно оновлено',
        });
      });
  }
}
