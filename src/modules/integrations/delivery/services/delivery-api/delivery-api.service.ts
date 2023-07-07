import { AxiosError } from 'axios';
import { Observable, catchError, firstValueFrom } from 'rxjs';

import { BadRequestException } from '@nestjs/common';

import {
  GetDeliveryStatusesDto,
  GetDeliveryStatusesResponse,
} from '@interfaces/delivery';

export abstract class DeliveryApiService {
  abstract readonly apiUrl: string;

  abstract getDeliveryStatuses(
    trackingInfo: GetDeliveryStatusesDto,
  ): Promise<GetDeliveryStatusesResponse>;

  protected makeApiCall<T>(apiCall: Observable<T>): Promise<T> {
    return firstValueFrom(
      apiCall.pipe(
        catchError((error: AxiosError) => {
          throw new BadRequestException(
            'Не вдалось отримати інформацію від сервісу доставки',
            {
              cause: error,
            },
          );
        }),
      ),
    );
  }
}
