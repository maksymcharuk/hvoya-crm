import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { Subject, debounceTime, takeUntil } from 'rxjs';

import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { DeliveryStatus } from '@shared/enums/delivery-status.enum';
import { OrderReturnRequestStatus } from '@shared/enums/order-return-request-status.enum';
import { RequestType } from '@shared/enums/request-type.enum';
import { RequestEntity } from '@shared/interfaces/entities/request.entity';
import { PageOptions } from '@shared/interfaces/page-options.interface';
import { Page } from '@shared/interfaces/page.interface';

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.scss'],
})
export class RequestListComponent implements OnDestroy {
  private requestsInternal: Page<RequestEntity> | null = null;
  private destroy$ = new Subject();

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
  deliveryStatuses = Object.entries(DeliveryStatus).map((key) => {
    const [label, value] = key;

    return {
      value,
      label,
    };
  });
  requestTypes = Object.entries(RequestType).map((key) => {
    const [label, value] = key;

    return {
      value,
      label,
    };
  });

  @Input() set requests(requests: Page<RequestEntity> | null) {
    this.requestsInternal = requests;
    if (requests) {
      this.loading = false;
    }
  }
  @Input() adminView: boolean = false;
  @Output() onLoadData = new EventEmitter<PageOptions>();
  @ViewChild('requestsTable') requestsTable!: Table;

  get requests(): Page<RequestEntity> | null {
    return this.requestsInternal;
  }

  get searchControl() {
    return this.searchForm.get('search');
  }

  constructor(private fb: FormBuilder) {
    this.searchControl?.valueChanges
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe((query) => {
        this.requestsTable.filterGlobal(query, 'contains');
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onLazyLoad(event: LazyLoadEvent) {
    this.loading = true;
    if (this.requests) {
      this.requests.data = [];
    }
    this.onLoadData.emit(new PageOptions(event));
  }
}
