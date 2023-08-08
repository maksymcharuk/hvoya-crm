import { BehaviorSubject } from 'rxjs';

import { ChangeDetectorRef, Component } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

import { RequestItemUIEntity } from '@shared/interfaces/ui-entities/request-item.ui-entity';

@Component({
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: ReturnRequestOrderItemComponent,
    },
  ],
  selector: 'app-return-request-order-item',
  templateUrl: './return-request-order-item.component.html',
  styleUrls: ['./return-request-order-item.component.scss'],
})
export class ReturnRequestOrderItemComponent implements ControlValueAccessor {
  requestItem!: RequestItemUIEntity;
  onChange: any;
  maxQuantity!: number;

  updating$ = new BehaviorSubject<number>(0);

  quantityForm = this.fb.group({
    quantity: [1],
  });

  get quantityControl(): AbstractControl {
    return this.quantityForm.get('quantity')!;
  }

  constructor(private fb: FormBuilder, private ref: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.quantityControl?.patchValue(this.requestItem.quantity, {
      emitEvent: false,
    });
    this.quantityControl?.valueChanges.subscribe((quantity) => {
      this.requestItem.quantity = quantity;
      this.onChange(this.requestItem);
    });
    this.ref.detectChanges();
  }

  writeValue(requestItem: RequestItemUIEntity) {
    this.requestItem = requestItem;
    this.maxQuantity = requestItem.quantity;
  }

  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  registerOnTouched() {}
}
