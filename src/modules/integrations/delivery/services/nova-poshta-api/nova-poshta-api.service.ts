import { AxiosResponse } from 'axios';
import { map } from 'rxjs';

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { DeliveryStatus } from '@enums/delivery-status.enum';
import {
  GetDeliveryStatusesDto,
  GetDeliveryStatusesResponse,
} from '@interfaces/delivery';
import { DeliveryServiceRawStatus } from '@interfaces/delivery/get-delivery-statuses.response';
import {
  NovaPoshtaGetDeliveryStatusesRequest,
  NovaPoshtaGetDeliveryStatusesResponse,
} from '@interfaces/delivery/nova-poshta';

import { getStatus } from '../../maps/nova-poshta-status.map';
import { DeliveryApiService } from '../delivery-api/delivery-api.service';

const NOVA_POSHTA_API_URL = 'https://api.novaposhta.ua/v2.0/json/';

@Injectable()
export class NovaPoshtaApiService extends DeliveryApiService {
  readonly apiKey = this.configService.get<string>('NOVA_POSHTA_API_KEY') ?? '';
  readonly apiUrl = NOVA_POSHTA_API_URL;
  readonly CHUNK_SIZE = 100;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    super();
  }

  async getDeliveryStatuses(
    getDeliveryStatusesDto: GetDeliveryStatusesDto,
  ): Promise<GetDeliveryStatusesResponse> {
    // Nova Poshta API doesn't allow to get statuses for more than 100 tracking numbers
    // Split tracking numbers into chunks of 100, get statuses for each chunk and merge them
    const response = (
      await Promise.all(
        getDeliveryStatusesDto.trackingInfo
          .map((_trackingInfo, index) =>
            index % this.CHUNK_SIZE === 0
              ? getDeliveryStatusesDto.trackingInfo.slice(
                  index,
                  index + this.CHUNK_SIZE,
                )
              : null,
          )
          .filter((trackingInfo) => trackingInfo !== null)
          .map((trackingInfo) =>
            this.getDeliveryStatusesInternal({
              trackingInfo: trackingInfo!,
            }),
          ),
      )
    ).reduce((acc, res) => {
      acc.statuses = [...acc.statuses, ...res.statuses];
      return acc;
    }, new GetDeliveryStatusesResponse());

    const statusesNewTrackingId = response.statuses.filter(
      (status) =>
        // If a parcel was declined, we don't need to get statuses for the new tracking number
        status.newTrackingId && status.status !== DeliveryStatus.Declined,
    );

    // If delivery address was changed when a parcel was in transit
    // then we need to get statuses for the last created on the basis number
    // as Nova Poshta created new tracking number for the new address
    if (statusesNewTrackingId.length !== 0) {
      const statuses = await this.getDeliveryStatusesInternal({
        trackingInfo: statusesNewTrackingId.map((status) => ({
          trackingId: status.newTrackingId as string,
          phone: '',
        })),
      });

      return new GetDeliveryStatusesResponse({
        statuses: response.statuses.map((status) => {
          const newTrackingIdStatus = statuses.statuses.find(
            (s) => s.trackingId === status.newTrackingId,
          );

          return new DeliveryServiceRawStatus({
            ...status,
            status: newTrackingIdStatus?.status ?? status.status,
            rawStatus: newTrackingIdStatus?.rawStatus ?? status.rawStatus,
          });
        }),
      });
    }

    return response;
  }

  private getDeliveryStatusesInternal(
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
                  date: new Date(status.TrackingUpdateDate).toString(),
                  status: getStatus(status.Status),
                  rawStatus: status.Status,
                  newTrackingId: status.LastCreatedOnTheBasisNumber,
                })),
              });
            },
          ),
        ),
    );
  }
}
