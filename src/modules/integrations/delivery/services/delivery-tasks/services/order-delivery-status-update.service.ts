import { DataSource } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { COMPLETED_ORDER_STATUSES } from '@constants/order.constants';
import { OrderDeliveryEntity } from '@entities/order-delivery.entity';
import { OrderStatusEntity } from '@entities/order-status.entity';
import { OrderEntity } from '@entities/order.entity';
import { DeliveryService } from '@enums/delivery-service.enum';
import { DeliveryStatus } from '@enums/delivery-status.enum';
import { NotificationEvent } from '@enums/notification-event.enum';
import { NotificationType } from '@enums/notification-type.enum';
import { DeliveryServiceRawStatus } from '@interfaces/delivery/get-delivery-statuses.response';

import { DeliveryServiceFactory } from '@modules/integrations/delivery/factories/delivery-service/delivery-service.factory';
import { DeliveryStatusesToOrderStatuses } from '@modules/integrations/delivery/maps/delivery-statuses.map';

import { DeliveryStatusUpdateService } from './delivery-status-update.service';

@Injectable()
export class OrderDeliveryStatusUpdateService extends DeliveryStatusUpdateService<OrderEntity> {
  constructor(
    override readonly dataSource: DataSource,
    override readonly deliveryServiceFactory: DeliveryServiceFactory,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super(dataSource, deliveryServiceFactory);
  }

  async getEntitiesToUpdate(): Promise<OrderEntity[]> {
    // Get all orders where the latest status is not completed
    return this.manager
      .createQueryBuilder(OrderEntity, 'order')
      .leftJoinAndSelect('order.statuses', 'statuses')
      .leftJoinAndSelect('order.delivery', 'delivery')
      .leftJoinAndSelect('order.customer', 'customer')
      .andWhere('order.currentStatus NOT IN (:...completedStatuses)', {
        completedStatuses: COMPLETED_ORDER_STATUSES,
      })
      .andWhere('delivery.deliveryService != :selfPickup', {
        selfPickup: DeliveryService.SelfPickup,
      })
      .orderBy('order.createdAt', 'ASC')
      .getMany();
  }

  getEntityTrackingId(order: OrderEntity): string {
    return order.delivery.trackingId;
  }

  getEntityDeliveryService(order: OrderEntity): DeliveryService {
    return order.delivery.deliveryService!;
  }

  async updateEntityStatus(
    order: OrderEntity,
    deliveryStatus: DeliveryServiceRawStatus,
  ): Promise<void> {
    const delivery = await this.manager.findOne(OrderDeliveryEntity, {
      where: { id: order.delivery.id },
    });

    if (!delivery) {
      return;
    }

    if (delivery.rawStatus === deliveryStatus.rawStatus) {
      return;
    }

    await this.manager.update(OrderDeliveryEntity, order.delivery.id, {
      status: deliveryStatus.status,
      rawStatus: deliveryStatus.rawStatus,
    });

    await this.updateOrderStatus(deliveryStatus.status, order);
  }

  private async updateOrderStatus(
    currentDeliveryStatus: DeliveryStatus,
    order: OrderEntity,
  ) {
    DeliveryStatusesToOrderStatuses.forEach(async (value, key) => {
      if (key.includes(currentDeliveryStatus)) {
        // Create new status only if it is not the same as the latest one

        if (order.currentStatus === value) {
          return;
        }

        await this.manager.save(OrderEntity, {
          id: order.id,
          currentStatus: value,
        });

        const newStatus = await this.manager.save(OrderStatusEntity, {
          status: value,
          comment: 'Оновлено автоматично системою доставки',
          order: { id: order.id },
        });

        this.eventEmitter.emit(NotificationEvent.OrderUpdated, {
          data: this.dataSource.manager.create(OrderEntity, {
            ...order,
            statuses: [newStatus, ...order.statuses],
          }),
          userId: order.customer.id,
          type: NotificationType.OrderStatusUpdated,
        });
      }
    });
  }
}
