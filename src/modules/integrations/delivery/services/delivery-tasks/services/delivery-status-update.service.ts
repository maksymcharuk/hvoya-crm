import { DataSource } from 'typeorm';

import { Injectable } from '@nestjs/common';

import { DeliveryService } from '@enums/delivery-service.enum';
import { DeliveryServiceRawStatus } from '@interfaces/delivery/get-delivery-statuses.response';

import { DeliveryServiceFactory } from '@modules/integrations/delivery/factories/delivery-service/delivery-service.factory';

// Abstract template class which defines the skeleton of an algorithm
// in an operation, deferring some steps to subclasses.
@Injectable()
export abstract class DeliveryStatusUpdateService<T> {
  protected readonly manager = this.dataSource.createEntityManager();

  constructor(
    protected readonly dataSource: DataSource,
    protected readonly deliveryServiceFactory: DeliveryServiceFactory,
  ) {}

  async updateStatuses(): Promise<void> {
    // Get all entities statuses are to be updated for
    const entities = await this.getEntitiesToUpdate();

    // If no entities to update delivery statuses for, return
    if (!entities || entities.length === 0) {
      return;
    }

    // Get delivery statuses for all orders base on delivery service
    let statuses = [];
    for (let deliveryServiceName of Object.values(DeliveryService)) {
      const deliveryService =
        this.deliveryServiceFactory.getDeliveryService(deliveryServiceName);
      if (!deliveryService) {
        continue;
      }
      const trackingInfo = entities
        .filter(
          (entity) =>
            this.getEntityDeliveryService(entity) === deliveryServiceName &&
            this.getEntityTrackingId(entity),
        )
        .map((entity) => ({
          trackingId: this.getEntityTrackingId(entity),
        }));
      if (!trackingInfo || trackingInfo.length === 0) {
        continue;
      }
      const res = await deliveryService.getDeliveryStatuses({
        trackingInfo,
      });

      if (res && res.statuses && res.statuses.length > 0) {
        statuses.push(...res.statuses);
      }
    }

    // Update delivery statuses for orders
    for (let entity of entities) {
      const deliveryStatus = statuses.find(
        (status) => status.trackingId === this.getEntityTrackingId(entity),
      );
      // If delivery status for order is not found, skip
      if (!deliveryStatus) {
        continue;
      }
      this.updateEntityStatus(entity, deliveryStatus);
    }
  }

  protected abstract getEntitiesToUpdate(): Promise<T[]>;
  protected abstract getEntityTrackingId(entity: T): string;
  protected abstract getEntityDeliveryService(entity: T): DeliveryService;
  protected abstract updateEntityStatus(
    entity: T,
    deliveryStatus: DeliveryServiceRawStatus,
  ): Promise<void>;
}
