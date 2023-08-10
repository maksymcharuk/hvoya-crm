import { Injectable } from '@nestjs/common';

import { OrderReturnDeliveryEntity } from '@entities/order-return-delivery.entity';
import { OrderReturnRequestEntity } from '@entities/order-return-request.entity';
import { DeliveryService } from '@enums/delivery-service.enum';
import { DeliveryStatus } from '@enums/delivery-status.enum';
import { OrderReturnRequestStatus } from '@enums/order-return-request-status.enum';
import { DeliveryServiceRawStatus } from '@interfaces/delivery/get-delivery-statuses.response';

import { DeliveryStatusUpdateService } from './delivery-status-update.service';

@Injectable()
export class ReturnRequestDeliveryStatusUpdateService extends DeliveryStatusUpdateService<OrderReturnRequestEntity> {
  async getEntitiesToUpdate(): Promise<OrderReturnRequestEntity[]> {
    // Get all return requests where the latest status is not completed
    return this.manager
      .createQueryBuilder(OrderReturnRequestEntity, 'returnRequest')
      .leftJoinAndSelect('returnRequest.delivery', 'delivery')
      .andWhere(
        'returnRequest.status NOT IN (:...completedReturnRequestStatuses) AND delivery.status NOT IN (:...completedDeliveryStatuses)',
        {
          completedReturnRequestStatuses: [
            OrderReturnRequestStatus.Approved,
            OrderReturnRequestStatus.Declined,
          ],
          completedDeliveryStatuses: [
            DeliveryStatus.Received,
            DeliveryStatus.Declined,
            DeliveryStatus.Returned,
          ],
        },
      )
      .getMany();
  }

  getEntityTrackingId(returnRequest: OrderReturnRequestEntity): string {
    return returnRequest.delivery.trackingId;
  }

  getEntityDeliveryService(
    returnRequest: OrderReturnRequestEntity,
  ): DeliveryService {
    return returnRequest.delivery.deliveryService!;
  }

  async updateEntityStatus(
    returnRequest: OrderReturnRequestEntity,
    deliveryStatus: DeliveryServiceRawStatus,
  ): Promise<void> {
    await this.manager.update(
      OrderReturnDeliveryEntity,
      returnRequest.delivery.id,
      {
        status: deliveryStatus.status,
        rawStatus: deliveryStatus.rawStatus,
      },
    );
  }
}
