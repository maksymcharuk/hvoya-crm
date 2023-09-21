import { DeliveryStatus } from '@enums/delivery-status.enum';

interface DeliveryServiceRawStatusParams {
  trackingId: string;
  date: string;
  status: DeliveryStatus;
  rawStatus: string;
  newTrackingId?: string;
}

export class DeliveryServiceRawStatus {
  private _newTrackingId?: string;

  set newTrackingId(value: string | undefined) {
    this._newTrackingId = value?.trim();
  }

  get newTrackingId(): string | undefined {
    let result;

    if (
      this._newTrackingId?.trim() !== '' &&
      !this._newTrackingId?.includes('-')
    ) {
      result = this._newTrackingId;
    }

    return result;
  }

  trackingId: string;
  date: string;
  status: DeliveryStatus;
  rawStatus: string;

  constructor(data?: DeliveryServiceRawStatusParams) {
    this.trackingId = data?.trackingId ?? '';
    this.date = data?.date ?? '';
    this.status = data?.status ?? DeliveryStatus.Unspecified;
    this.rawStatus = data?.rawStatus ?? '';
    this.newTrackingId = data?.newTrackingId ?? '';
  }
}

interface GetDeliveryStatusesResponseParams {
  statuses: DeliveryServiceRawStatusParams[];
}

export class GetDeliveryStatusesResponse {
  statuses: DeliveryServiceRawStatus[];

  constructor(data?: GetDeliveryStatusesResponseParams) {
    this.statuses =
      data?.statuses.map((status) => new DeliveryServiceRawStatus(status)) ||
      [];
  }
}
