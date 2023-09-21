import { NovaPoshtaBaseResponse } from './base.response';

class NovaPoshtaGetDeliveryStatusesResponseParams {
  Number: string;
  TrackingUpdateDate: string;
  Status: string;
  LastCreatedOnTheBasisNumber: string;
}

export class NovaPoshtaGetDeliveryStatusesResponse extends NovaPoshtaBaseResponse<NovaPoshtaGetDeliveryStatusesResponseParams> {}
