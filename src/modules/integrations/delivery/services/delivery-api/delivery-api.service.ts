import { Observable, firstValueFrom } from 'rxjs';

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
    return firstValueFrom(apiCall);
  }
}
