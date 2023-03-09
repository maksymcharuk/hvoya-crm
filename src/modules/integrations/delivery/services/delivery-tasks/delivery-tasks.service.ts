import { DataSource, In, Not } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { OrderDeliveryEntity } from '@entities/order-delivery.entity';
import { OrderEntity } from '@entities/order.entity';
import { DeliveryService } from '@enums/delivery-service.enum';
import { OrderDeliveryStatus } from '@enums/order-delivery-status.enum';
import { OrderStatus } from '@enums/order-status.enum';

import { DeliveryServiceFactory } from '../../factories/delivery-service/delivery-service.factory';
import { getStatus } from '../../maps/nova-poshta-status.map';

@Injectable()
export class DeliveryTasksService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly deliveryServiceFactory: DeliveryServiceFactory,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async updateOrderDeliveryStatuses() {
    const manager = this.dataSource.createEntityManager();

    const orders = await manager.find(OrderEntity, {
      where: {
        status: Not(
          In([
            OrderStatus.Pending,
            OrderStatus.Cancelled,
            OrderStatus.Fulfilled,
            OrderStatus.Refunded,
          ]),
        ),
      },
      relations: ['delivery'],
    });

    const deliveryService = this.deliveryServiceFactory.getDeliveryService(
      DeliveryService.NovaPoshta,
    );
    const trackingInfo = orders.map((order) => ({
      trackingId: order.delivery.trackingId,
    }));
    const deliveryStatuses = await deliveryService?.getDeliveryStatuses({
      trackingInfo,
    });

    for (let order of orders) {
      const deliveryStatus = deliveryStatuses?.statuses.find(
        (status) => status.trackingId === order.delivery.trackingId,
      );
      if (deliveryStatus) {
        const status = getStatus(deliveryStatus.status);

        await manager.update(OrderDeliveryEntity, order.delivery.id, {
          status: status,
        });

        if (
          [
            OrderDeliveryStatus.Declined,
            OrderDeliveryStatus.Received,
            OrderDeliveryStatus.Returned,
          ].includes(status)
        ) {
          await manager.update(OrderEntity, order.id, {
            status: OrderStatus.Fulfilled,
          });
        }

        if (
          [
            OrderDeliveryStatus.Accepted,
            OrderDeliveryStatus.Processing,
            OrderDeliveryStatus.Sent,
          ].includes(status)
        ) {
          await manager.update(OrderEntity, order.id, {
            status: OrderStatus.TransferedToDelivery,
          });
        }
      }
    }
  }
}
