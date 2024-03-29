import { Pipe, PipeTransform } from '@angular/core';

import { RequestType } from '@shared/enums/request-type.enum';

@Pipe({
  name: 'requestType',
})
export class RequestTypePipe implements PipeTransform {
  transform(value: RequestType): string {
    switch (value) {
      case RequestType.Return:
        return 'Повернення';
      case RequestType.FundsWithdrawal:
        return 'Виведення коштів';
      default:
        return 'Невідомий тип запиту';
    }
  }
}
