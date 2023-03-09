import { IsString } from 'class-validator';

import { NovaPoshtaBaseResponse } from './base.response';

class NovaPoshtaGetDeliveryStatusesResponseParams {
  @IsString()
  Number: string;

  @IsString()
  TrackingUpdateDate: string;

  @IsString()
  Status: string;
}

export class NovaPoshtaGetDeliveryStatusesResponse extends NovaPoshtaBaseResponse<NovaPoshtaGetDeliveryStatusesResponseParams> {}
