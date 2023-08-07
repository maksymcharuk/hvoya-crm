import { ChangeDetectorRef, Component } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormBuilder, NG_VALUE_ACCESSOR } from '@angular/forms';

import { OrderItem } from '@shared/interfaces/entities/order.entity';

import { BehaviorSubject } from 'rxjs';

@Component({
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: ReturnRequestOrderItemComponent
    }
  ],
  selector: 'app-return-request-order-item',
  templateUrl: './return-request-order-item.component.html',
  styleUrls: ['./return-request-order-item.component.scss']
})
export class ReturnRequestOrderItemComponent implements ControlValueAccessor {
  orderItem!: any;
  onChange: any;
  maxQuantity!: number;

  updating$ = new BehaviorSubject<number>(0);

  quantityForm = this.fb.group({
    quantity: [1],
  });

  get quantityControl(): AbstractControl {
    return this.quantityForm.get('quantity')!;
  }

  constructor(
    private fb: FormBuilder,
    private ref: ChangeDetectorRef,
  ) { }

  ngAfterViewInit(): void {
    this.quantityControl?.patchValue(this.orderItem.quantity, {
      emitEvent: false,
    });
    this.quantityControl?.valueChanges.subscribe((quantity) => {
      this.orderItem.quantity = quantity;
      this.onChange(this.orderItem);
    });
    this.ref.detectChanges();
  }

  writeValue(orderItem: OrderItem) {
    console.log(orderItem);
    this.orderItem = orderItem;
    this.orderItem.orderItemId = orderItem.id;
    this.maxQuantity = orderItem.quantity;
  }

  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  registerOnTouched() { }
}
