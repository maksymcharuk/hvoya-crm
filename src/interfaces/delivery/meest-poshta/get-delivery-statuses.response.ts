import { MeestPoshtaBaseResponse } from '../meest-poshta/base-get.response';
import { MeestPoshtaDeliveryCode } from './delivery-codes';

class MeestPoshtaGetDeliveryStatusesResponseParams {
  parcelNumber: string;
  barCode: string;
  eventDateTime: string;
  eventCode: MeestPoshtaDeliveryCode;
  eventCodeUPU: string;
  eventPlaces: string;
  eventCountryDescr: {
    descrUA: string;
    descrRU: string;
    descrEN: string;
  };
  eventCityDescr: {
    descrUA: string;
    descrRU: string;
    descrEN: string;
  };
  eventDescr: {
    descrUA: string;
    descrRU: string;
    descrEN: string;
  };
  eventDetailDescr: {
    descrUA: string;
    descrRU: string;
    descrEN: string;
  };
}

export class MeestPoshtaGetDeliveryStatusesResponse extends MeestPoshtaBaseResponse<MeestPoshtaGetDeliveryStatusesResponseParams> {}
