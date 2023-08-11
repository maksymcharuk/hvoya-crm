import { AxiosResponse } from 'axios';
import { map } from 'rxjs';

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  GetDeliveryStatusesDto,
  GetDeliveryStatusesResponse,
} from '@interfaces/delivery';
import { UkrPoshtaGetDeliveryStatusesResponse } from '@interfaces/delivery/ukr-poshta';

import { getStatus } from '../../maps/ukr-poshta-status.map';
import { DeliveryApiService } from '../delivery-api/delivery-api.service';

const UKR_POSHTA_API_URL = 'https://www.ukrposhta.ua/status-tracking/0.0.1/';

@Injectable()
export class UkrPoshtaApiService extends DeliveryApiService {
  readonly authToken =
    this.configService.get<string>('UKR_POSHTA_AUTH_TOKEN') ?? '';
  readonly apiUrl = UKR_POSHTA_API_URL;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    super();
  }

  getDeliveryStatuses(
    getDeliveryStatusesDto: GetDeliveryStatusesDto,
  ): Promise<GetDeliveryStatusesResponse> {
    const trackingIds = getDeliveryStatusesDto.trackingInfo.map(
      ({ trackingId }) => trackingId,
    );

    return Promise.allSettled(
      trackingIds.map((trackingId) => this.getDeliveryStatus(trackingId)),
    ).then(
      (
        responses: PromiseSettledResult<UkrPoshtaGetDeliveryStatusesResponse>[],
      ) => {
        const results = responses
          .filter((response) => response.status === 'fulfilled')
          .map(
            (
              response: PromiseFulfilledResult<UkrPoshtaGetDeliveryStatusesResponse>,
            ) => response.value,
          );
        return new GetDeliveryStatusesResponse({
          statuses: results.map((result) => ({
            trackingId: result.barcode,
            date: new Date(result.date).toString(),
            status: getStatus(result.eventName),
            rawStatus: result.eventName,
          })),
        });
      },
    );
  }

  private getDeliveryStatus(
    trackingId: string,
  ): Promise<UkrPoshtaGetDeliveryStatusesResponse> {
    return this.makeApiCall(
      this.httpService
        .get<UkrPoshtaGetDeliveryStatusesResponse>(
          `${this.apiUrl}/statuses/last?barcode=${trackingId}`,
          { headers: { Authorization: `Bearer ${this.authToken}` } },
        )
        .pipe(map((response: AxiosResponse) => response.data)),
    );
  }
}
