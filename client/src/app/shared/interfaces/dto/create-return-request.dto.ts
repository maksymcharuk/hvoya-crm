import { AbstractControl, FormArray, FormGroup } from '@angular/forms';

import { RequestType } from '@shared/enums/request-type.enum';

export interface CreateReturnRequestDto {
  trackingId: string;
  requestedItems: CreateReturnRequestItemDto[];
  waybill?: File;
  customerComment: string;
  requestType: RequestType.Return;
}

export interface CreateReturnRequestFormGroup extends FormGroup {
  value: CreateReturnRequestDto;

  controls: {
    trackingId: AbstractControl;
    waybill: AbstractControl;
    requestedItems: FormArray;
    customerComment: AbstractControl;
    requestType: AbstractControl;
  };
}

export interface CreateReturnRequestItemDto {
  quantity: number;
  orderItemId: string;
}

export interface CreateReturnRequestItemFormGroup extends FormGroup {
  value: CreateReturnRequestItemDto;

  controls: {
    quantity: AbstractControl;
    orderItemId: AbstractControl;
  };
}
