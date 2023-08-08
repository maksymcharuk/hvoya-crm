import { Component } from '@angular/core';

import { RequestType } from '@shared/enums/request-type.enum';

@Component({
  selector: 'app-request-create',
  templateUrl: './request-create.component.html',
  styleUrls: ['./request-create.component.scss'],
})
export class RequestCreateComponent {
  selectedType: RequestType = RequestType.Return;
  requestType = RequestType;
  requestTypes = Object.entries(RequestType).map((key) => {
    const [label, value] = key;

    return {
      value,
      label,
    };
  });
}
