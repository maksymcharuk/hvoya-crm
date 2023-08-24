import { Component } from '@angular/core';

import { RequestsService } from '@shared/services/requests.service';

@Component({
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.scss']
})
export class RequestListComponent {
  requests$ = this.requestsService.getRequests();

  constructor(private requestsService: RequestsService) { }
}
