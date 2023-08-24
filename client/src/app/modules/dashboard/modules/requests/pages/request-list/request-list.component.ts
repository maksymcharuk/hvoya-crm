import { Component } from '@angular/core';

import { RequestsService } from '@shared/services/requests.service';
import { OrderReturnRequest } from '@shared/interfaces/entities/order-return-request.entity';

@Component({
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.scss']
})
export class RequestListComponent {

  readonly returnRequestEntity = OrderReturnRequest;

  requests$ = this.requestsService.getRequests();

  constructor(private requestsService: RequestsService) { }

}
