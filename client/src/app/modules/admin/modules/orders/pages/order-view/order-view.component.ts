import { MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import {
  BehaviorSubject,
  Subject,
  debounceTime,
  distinctUntilChanged,
  finalize,
  takeUntil,
  tap,
} from 'rxjs';

import { Component, OnDestroy, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FIELD_UPDATE_DEBOUNCE_TIME } from '@shared/constants/base.constants';
import {
  COMMENT_REQUIRED_ORDER_STATUSES,
  MANUAL_ORDER_STATUSES,
  WAYBILL_ACCEPTABLE_FILE_FORMATS,
} from '@shared/constants/order.constants';
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
export class OrderViewComponent implements OnDestroy {
  @ViewChild('waybillUpload') waybillUpload!: FileUpload;

  private readonly destroy$ = new Subject<void>();

  order$ = new BehaviorSubject<Order | null>(null);
  waybillSubmitting$ = new BehaviorSubject<boolean>(false);
  statusSubmitting$ = new BehaviorSubject<boolean>(false);
  statusEdit = false;
  orderStatuses = MANUAL_ORDER_STATUSES.map((status) => ({
    label: status,
    value: status,
  }));
  fileFormats = WAYBILL_ACCEPTABLE_FILE_FORMATS;
  showWaybillViewDialog = false;
  showOrderStatusDialog = false;
  isNoteSaving = false;

  updateWaybillForm = this.formBuilder.group({
    trackingId: [
      '',
      [Validators.required, alphanumeric({ allowSpaces: true })],
    ],
    waybill: [''],
  }) as UpdateWaybillFormGroup;

  orderNoteForm = this.formBuilder.group({
    managerNote: [''],
  }) as OrderUpdateFormGroup;

  get managerNoteControl(): AbstractControl {
    return this.orderNoteForm.controls.managerNote!;
  }

  updateOrderStatusForm = this.formBuilder.group({
    orderStatus: ['', Validators.required],
    orderStatusComment: [''],
  }) as OrderUpdateFormGroup;

  get waybillControl(): AbstractControl {
    return this.updateWaybillForm.controls.waybill;
  }

  get orderStatusControl(): AbstractControl {
    return this.updateOrderStatusForm.controls.orderStatus!;
  }

  get orderStatusCommentControl(): AbstractControl {
    return this.updateOrderStatusForm.controls.orderStatusComment!;
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
      this.updateOrderStatusForm.patchValue({
        orderStatus: order.currentStatus.status,
      });
      this.orderNoteForm.patchValue(
        {
          managerNote: order.managerNote,
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

    this.statusSubmitting$.subscribe((submitting) => {
      submitting
        ? this.updateOrderStatusForm.disable()
        : this.updateOrderStatusForm.enable();
    });

    this.orderStatusControl.valueChanges.subscribe((value) => {
      if (COMMENT_REQUIRED_ORDER_STATUSES.includes(value)) {
        this.orderStatusCommentControl.setValidators(Validators.required);
        this.orderStatusCommentControl.updateValueAndValidity();
      } else {
        this.orderStatusCommentControl.clearValidators();
        this.orderStatusCommentControl.updateValueAndValidity();
      }
    });

    this.managerNoteControl.valueChanges
      .pipe(
        tap(() => (this.isNoteSaving = true)),
        takeUntil(this.destroy$),
        debounceTime(FIELD_UPDATE_DEBOUNCE_TIME),
        distinctUntilChanged((valueP, valueC) => {
          const equals = valueP === valueC;
          if (equals) {
            this.isNoteSaving = false;
          }
          return equals;
        }),
      )
      .subscribe((note) => {
        const formData = new FormData();
        formData.append('managerNote', note);
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
      .orderUpdate(this.route.snapshot.params['number'], formData)
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

  hideOrderStatusDialog() {
    this.showOrderStatusDialog = false;
  }

  saveOrderStatus() {
    if (!this.updateOrderStatusForm.valid) {
      this.updateOrderStatusForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    for (let key in this.updateOrderStatusForm.value) {
      const value = this.updateOrderStatusForm.get(key)?.value;
      if (value) {
        formData.append(key, this.updateOrderStatusForm.get(key)?.value);
      }
    }

    this.statusSubmitting$.next(true);
    this.ordersService
      .orderUpdate(this.route.snapshot.params['number'], formData)
      .pipe(
        finalize(() => {
          this.statusSubmitting$.next(false);
          this.updateOrderStatusForm.get('orderStatusComment')?.reset();
        }),
      )
      .subscribe((order: Order) => {
        this.order$.next(order);
        this.statusEdit = false;
        this.messageService.add({
          severity: 'success',
          detail: 'Статус замовлення успішно оновлено',
        });
      });
  }

  updateOrderNote(note: FormData) {
    this.ordersService
      .orderUpdate(this.route.snapshot.params['number'], note)
      .pipe(finalize(() => (this.isNoteSaving = false)))
      .subscribe((order: Order) => {
        this.order$.next(order);
        this.messageService.add({
          severity: 'success',
          detail: 'Нотатку успішно оновлено',
        });
      });
  }
}
