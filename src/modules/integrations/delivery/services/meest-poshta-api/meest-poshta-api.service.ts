import { AxiosResponse } from 'axios';
import { map } from 'rxjs';

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  GetDeliveryStatusesDto,
  GetDeliveryStatusesResponse,
} from '@interfaces/delivery';
import { DeliveryServiceRawStatus } from '@interfaces/delivery/get-delivery-statuses.response';
import { MeestPoshtaGetDeliveryStatusesResponse } from '@interfaces/delivery/meest-poshta';

import { getStatus } from '../../maps/meest-poshta-status.map';
import { DeliveryApiService } from '../delivery-api/delivery-api.service';

const MEEST_POSHTA_API_URL = 'https://api.meest.com/v3.0/openAPI';

@Injectable()
export class MeestPoshtaApiService extends DeliveryApiService {
  readonly authToken =
    this.configService.get<string>('MEEST_POSHTA_API_TOKEN') ?? '';
  readonly apiUrl = MEEST_POSHTA_API_URL;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    super();
  }

  async getDeliveryStatuses(
    getDeliveryStatusesDto: GetDeliveryStatusesDto,
  ): Promise<GetDeliveryStatusesResponse> {
    const trackingIds = getDeliveryStatusesDto.trackingInfo.map(
      ({ trackingId }) => trackingId,
    );

    const responses = await Promise.allSettled(
      trackingIds.map((trackingId) => this.getDeliveryStatus(trackingId)),
    ).then(
      (
        results: PromiseSettledResult<MeestPoshtaGetDeliveryStatusesResponse>[],
      ) => {
        return results
          .filter((result) => result.status === 'fulfilled')
          .map(
            (
              result: PromiseFulfilledResult<MeestPoshtaGetDeliveryStatusesResponse>,
            ) => result.value,
          );
      },
    );

    const statuses: DeliveryServiceRawStatus[] = [];
    for (const response of responses) {
      const [result] = response.result;
      if (!result) continue;
      statuses.push(
        new DeliveryServiceRawStatus({
          trackingId: result.parcelNumber,
          date: new Date(result.eventDateTime).toString(),
          status: getStatus(result.eventDescr.descrUA),
          rawStatus: result.eventDescr.descrUA,
        }),
      );
    }

    return new GetDeliveryStatusesResponse({
      statuses,
    });
  }

  private getDeliveryStatus(
    trackNumber: string,
  ): Promise<MeestPoshtaGetDeliveryStatusesResponse> {
    return this.makeApiCall(
      this.httpService
        .get<MeestPoshtaGetDeliveryStatusesResponse>(
          `${this.apiUrl}/tracking/${trackNumber}`,
          { headers: { token: this.authToken } },
        )
        .pipe(map((response: AxiosResponse) => response.data)),
    );
  }
}
