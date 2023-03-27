import { Injectable } from '@nestjs/common';

import { PresearchResponse } from '../interfaces/responses/presearch.response';

@Injectable()
export class PaymentApiService {
  constructor() {}

  presearch(): Promise<PresearchResponse> {
    return Promise.resolve(
      new PresearchResponse({
        fio: ['Иванов Иван Иванович', 'Иванов Иван Иванович 2'],
        ls: ['1210236', '1210236'],
      }),
    );
  }
}
