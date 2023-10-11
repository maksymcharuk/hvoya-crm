import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RequestType } from '@shared/enums/request-type.enum';

@Component({
  selector: 'app-request-create',
  templateUrl: './request-create.component.html',
  styleUrls: ['./request-create.component.scss'],
})
export class RequestCreateComponent {
  selectedType: RequestType;
  requestType = RequestType;
  requestTypes = Object.entries(RequestType).map((entry) => {
    const [label, value] = entry;

    return {
      value,
      label,
    };
  });

  constructor(private readonly route: ActivatedRoute) {
    this.selectedType = this.route.snapshot.queryParams['requestType'];
  }
}
