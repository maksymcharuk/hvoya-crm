import { Observable, map, switchMap } from 'rxjs';

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
  requestNumber$ = this.route.params.pipe(map((params) => params['number']));
  request$: Observable<RequestEntity | null>;
  returnRequestStatus = OrderReturnRequestStatus;
  showReceiptViewDialog = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly requestsService: RequestsService,
  ) {
    this.request$ = this.requestNumber$.pipe(
      switchMap((requestNumber) =>
        this.requestsService.getRequest(requestNumber),
      ),
    );
  }

  showReceiptViewDialogHandler() {
    this.showReceiptViewDialog = true;
  }
}
