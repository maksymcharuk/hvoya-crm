import { BehaviorSubject, Subject, takeUntil } from 'rxjs';

import { Component, OnDestroy } from '@angular/core';

import { RequestEntity } from '@shared/interfaces/entities/request.entity';
import { PageOptions } from '@shared/interfaces/page-options.interface';
import { Page } from '@shared/interfaces/page.interface';
import { RequestsService } from '@shared/services/requests.service';

@Component({
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.scss'],
})
export class RequestListComponent implements OnDestroy {
  destroyed$ = new Subject<void>();
  pageRequests$ = new BehaviorSubject<Page<RequestEntity> | null>(null);

  constructor(private requestsService: RequestsService) {}

  loadOrders(pageOptions: PageOptions) {
    this.requestsService
      .getRequests(pageOptions)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((requests) => {
        this.pageRequests$.next(requests);
      });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
