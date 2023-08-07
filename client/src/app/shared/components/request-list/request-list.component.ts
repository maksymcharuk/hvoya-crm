import { Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { OrderDeliveryStatus } from '@shared/enums/order-delivery-status.enum';
import { OrderReturnRequestStatus } from '@shared/enums/order-return-request-status.enum';
import { RequestEntity } from '@shared/interfaces/entities/request.entity';

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.scss']
})
export class RequestListComponent {

  private requestsInternal: RequestEntity[] = [];

  loading = true;
  searchForm = this.fb.group({
    search: [''],
  });
  requestStatuses = Object.entries(OrderReturnRequestStatus).map((key) => {
    const [label, value] = key;

    return {
      value,
      label,
    };
  });
  deliveryStatuses = Object.entries(OrderDeliveryStatus).map((key) => {
    const [label, value] = key;

    return {
      value,
      label,
    };
  });

  @Input() set requests(requests: RequestEntity[] | null) {
    if (!requests) {
      return;
    }
    this.requestsInternal = requests;
    this.loading = false;
  }
  @Input() adminView!: boolean;

  get requests(): any[] {
    return this.requestsInternal;
  }

  get globalFilterFields() {
    const defaultFilterFields = ['total'];
    return this.adminView
      ? [
        ...defaultFilterFields,
        'customer.firstName',
        'customer.lastName',
        'customer.middleName',
      ]
      : defaultFilterFields;
  }

  constructor(private fb: FormBuilder) { }
}
