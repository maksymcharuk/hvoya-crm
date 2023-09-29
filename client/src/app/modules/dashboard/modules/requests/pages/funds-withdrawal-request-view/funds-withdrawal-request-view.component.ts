import { BehaviorSubject } from 'rxjs';

import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { OrderReturnRequestStatus } from '@shared/enums/order-return-request-status.enum';
import { RequestEntity } from '@shared/interfaces/entities/request.entity';
import { RequestsService } from '@shared/services/requests.service';

@Component({
  selector: 'app-funds-withdrawal-request-view',
  templateUrl: './funds-withdrawal-request-view.component.html',
  styleUrls: ['./funds-withdrawal-request-view.component.scss'],
})
export class FundsWithdrawalRequestViewComponent {
  requestNumber = this.route.snapshot.params['number'];
  request$ = new BehaviorSubject<RequestEntity | null>(null);
  returnRequestStatus = OrderReturnRequestStatus;
  showReceiptViewDialog = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly requestsService: RequestsService,
  ) {
    this.requestsService.getRequest(this.requestNumber).subscribe((request) => {
      this.request$.next(request);
    });
  }

  showReceiptViewDialogHandler() {
    this.showReceiptViewDialog = true;
  }
}
