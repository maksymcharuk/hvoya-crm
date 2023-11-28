import { ConfirmationService, MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import {
  BehaviorSubject,
  Subject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
  mergeMap,
  of,
  takeUntil,
  tap,
} from 'rxjs';

import { Component, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import {
  FIELD_UPDATE_DEBOUNCE_TIME,
  ICONS,
} from '@shared/constants/base.constants';
import { WAYBILL_ACCEPTABLE_FILE_FORMATS } from '@shared/constants/order.constants';
import { DeliveryService } from '@shared/enums/delivery-service.enum';
import { OrderStatus } from '@shared/enums/order-status.enum';
import { RequestType } from '@shared/enums/request-type.enum';
import { Role } from '@shared/enums/role.enum';
import { OrderUpdateFormGroup } from '@shared/interfaces/dto/update-order.dto';
import { UpdateWaybillFormGroup } from '@shared/interfaces/dto/update-waybill.dto';
import { Order } from '@shared/interfaces/entities/order.entity';
import { OrdersService } from '@shared/services/orders.service';
import { alphanumeric } from '@shared/validators/alphanumeric.validator';

import { UserBalanceService } from '../../../balance/services/user-balance.service';

@Component({
  selector: 'app-order-view',
  templateUrl: './order-view.component.html',
  styleUrls: ['./order-view.component.scss'],
})
export class OrderViewComponent {
  @ViewChild('waybillUpload') waybillUpload!: FileUpload;

  private readonly destroy$ = new Subject<void>();

  ICONS = ICONS;

  orderNumber$ = this.route.params.pipe(map((params) => params['number']));
  order$ = new BehaviorSubject<Order | null>(null);
  waybillSubmitting$ = new BehaviorSubject<boolean>(false);
  orderStatusEnum = OrderStatus;
  roleEnum = Role;
  fileFormats = WAYBILL_ACCEPTABLE_FILE_FORMATS;
  showWaybillViewDialog = false;
  isNoteSaving = false;
  deliveryServices = Object.values(DeliveryService);
  DeliveryService = DeliveryService;
  RequestType = RequestType;
  isSelfPickup = false;

  trackingIdValidators = [
    Validators.required,
    alphanumeric({ allowSpaces: true }),
  ];
  waybillValidators = [Validators.required];

  orderNoteForm = this.formBuilder.group({
    customerNote: [''],
  }) as OrderUpdateFormGroup;

  get customerNoteControl(): AbstractControl {
    return this.orderNoteForm.controls.customerNote!;
  }

  updateWaybillForm = this.formBuilder.group({
    trackingId: ['', this.trackingIdValidators],
    deliveryService: [DeliveryService.SelfPickup, Validators.required],
    waybill: ['', this.waybillValidators],
  }) as UpdateWaybillFormGroup;

  get deliveryServiceControl(): AbstractControl {
    return this.updateWaybillForm.controls.deliveryService!;
  }

  get waybillControl(): AbstractControl {
    return this.updateWaybillForm.controls.waybill;
  }

  get trackingIdControl(): AbstractControl {
    return this.updateWaybillForm.controls.trackingId;
  }

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly ordersService: OrdersService,
    private readonly userBalanceService: UserBalanceService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly title: Title,
  ) {
    this.orderNumber$.subscribe((orderNumber) => {
      this.ordersService.getOrder(orderNumber).subscribe((order) => {
        this.order$.next(order);
      });
      this.title.setTitle(`Замовлення №${orderNumber} - Hvoya CRM`);
    });

    this.order$.subscribe((order) => {
      if (!order) {
        return;
      }
      this.updateWaybillForm.patchValue({
        trackingId: order.delivery.trackingId,
        deliveryService: order.delivery.deliveryService,
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
      .pipe(
        tap(() => (this.isNoteSaving = true)),
        debounceTime(FIELD_UPDATE_DEBOUNCE_TIME),
        takeUntil(this.destroy$),
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
        formData.append('customerNote', note);
        this.updateOrderNote(formData);
      });

    this.deliveryServiceControl?.valueChanges.subscribe((value) => {
      if (value === DeliveryService.SelfPickup) {
        this.isSelfPickup = true;
        this.trackingIdControl?.clearValidators();
        this.trackingIdControl?.disable();
        this.waybillControl?.clearValidators();
        this.waybillControl?.disable();
      } else {
        this.isSelfPickup = false;
        this.trackingIdControl?.setValidators(this.trackingIdValidators);
        this.trackingIdControl?.enable();
        this.waybillControl?.setValidators(this.waybillValidators);
        this.waybillControl?.enable();
      }
      this.trackingIdControl?.updateValueAndValidity();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFileUpload(event: any) {
    this.waybillControl.patchValue(event.files[0]);
  }

  getOrderNumber(): string {
    return this.route.snapshot.params['number'];
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
    formData.append(
      'deliveryService',
      this.updateWaybillForm.get('deliveryService')?.value,
    );
    formData.append('waybill', this.updateWaybillForm.get('waybill')?.value);

    this.waybillSubmitting$.next(true);
    this.ordersService
      .updateByCustomer(this.getOrderNumber(), formData)
      .pipe(finalize(() => this.waybillSubmitting$.next(false)))
      .subscribe((order: Order) => {
        this.order$.next(order);
        this.waybillUpload?.clear();
        this.waybillControl?.reset();
        this.messageService.add({
          severity: 'success',
          detail: 'Дані доставки успішно оновлено',
        });
      });
  }

  updateOrderNote(note: FormData) {
    this.ordersService
      .updateByCustomer(this.getOrderNumber(), note)
      .pipe(finalize(() => (this.isNoteSaving = false)))
      .subscribe((order: Order) => {
        this.order$.next(order);
        this.messageService.add({
          severity: 'success',
          detail: 'Коментар успішно оновлено',
        });
      });
  }

  confirmOrderCancelation() {
    this.confirmationService.confirm({
      accept: () => {
        this.ordersService
          .cancelOrderByCustomer(this.getOrderNumber())
          .pipe(
            mergeMap((order) => {
              return combineLatest([
                of(order),
                this.userBalanceService.getUserBalance(),
              ]);
            }),
          )
          .subscribe(([order]) => {
            this.order$.next(order);
            this.messageService.add({
              severity: 'success',
              detail: 'Замовлення успішно скасовано',
            });
          });
      },
    });
  }
}
