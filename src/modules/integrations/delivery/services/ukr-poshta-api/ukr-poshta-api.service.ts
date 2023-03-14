import { AxiosResponse } from 'axios';
import { map } from 'rxjs';

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  GetDeliveryStatusesDto,
  GetDeliveryStatusesResponse,
} from '@interfaces/delivery';
import {
  UkrPoshtaGetDeliveryStatusesRequest,
  UkrPoshtaGetDeliveryStatusesResponse,
} from '@interfaces/delivery/ukr-poshta';

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
    return this.makeApiCall(
      this.httpService
        .post<UkrPoshtaGetDeliveryStatusesResponse[]>(
          `${this.apiUrl}statuses/last`,
          new UkrPoshtaGetDeliveryStatusesRequest({
            trackingIds: getDeliveryStatusesDto.trackingInfo.map(
              ({ trackingId }) => trackingId,
            ),
          }).trackingIds,
          { headers: { Authorization: `Bearer ${this.authToken}` } },
        )
        .pipe(
          map(
            (
              response: AxiosResponse<UkrPoshtaGetDeliveryStatusesResponse[]>,
            ) => {
              return new GetDeliveryStatusesResponse({
                statuses: response.data.map((status) => ({
                  trackingId: status.barcode,
                  date: new Date(status.date).toString(),
                  status: getStatus(status.eventName),
                })),
              });
            },
          ),
        ),
    );
  }
}
