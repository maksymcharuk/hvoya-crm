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
  NovaPoshtaGetDeliveryStatusesRequest,
  NovaPoshtaGetDeliveryStatusesResponse,
} from '@interfaces/delivery/nova-poshta';

import { DeliveryApiService } from '../delivery-api/delivery-api.service';

const NOVA_POSHTA_API_URL = 'https://api.novaposhta.ua/v2.0/json/';

@Injectable()
export class NovaPoshtaApiService extends DeliveryApiService {
  readonly apiKey = this.configService.get<string>('NOVA_POSHTA_API_KEY') ?? '';
  readonly apiUrl = NOVA_POSHTA_API_URL;

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
        .post<NovaPoshtaGetDeliveryStatusesResponse>(
          this.apiUrl,
          new NovaPoshtaGetDeliveryStatusesRequest({
            apiKey: this.apiKey,
            modelName: 'TrackingDocument',
            calledMethod: 'getStatusDocuments',
            methodProperties: {
              Documents: getDeliveryStatusesDto.trackingInfo.map(
                ({ trackingId, phone }) => ({
                  DocumentNumber: trackingId,
                  Phone: phone,
                }),
              ),
            },
          }),
        )
        .pipe(
          map(
            (
              response: AxiosResponse<NovaPoshtaGetDeliveryStatusesResponse>,
            ) => {
              return new GetDeliveryStatusesResponse({
                statuses: response.data.data.map((status) => ({
                  trackingId: status.Number,
                  date: status.TrackingUpdateDate,
                  status: status.Status,
                })),
              });
            },
          ),
        ),
    );
  }
}
