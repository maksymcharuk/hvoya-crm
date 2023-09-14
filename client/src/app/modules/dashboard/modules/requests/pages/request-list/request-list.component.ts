import { BehaviorSubject } from 'rxjs';

import { Component } from '@angular/core';

import { OrderReturnRequest } from '@shared/interfaces/entities/order-return-request.entity';
import { RequestEntity } from '@shared/interfaces/entities/request.entity';
import { PageOptions } from '@shared/interfaces/page-options.interface';
import { Page } from '@shared/interfaces/page.interface';
import { RequestsService } from '@shared/services/requests.service';

@Component({
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.scss'],
})
export class RequestListComponent {
  pageRequests$ = new BehaviorSubject<Page<RequestEntity> | null>(null);

  readonly returnRequestEntity = OrderReturnRequest;

  constructor(private requestsService: RequestsService) {}

  loadOrders(pageOptions: PageOptions) {
    this.requestsService.getRequests(pageOptions).subscribe((requests) => {
      this.pageRequests$.next(requests);
    });
  }
}
