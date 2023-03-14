import { DataSource, In, Not } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { OrderDeliveryEntity } from '@entities/order-delivery.entity';
import { OrderEntity } from '@entities/order.entity';
import { DeliveryService } from '@enums/delivery-service.enum';
import { OrderDeliveryStatus } from '@enums/order-delivery-status.enum';
import { OrderStatus } from '@enums/order-status.enum';
import { GetDeliveryStatusesResponse } from '@interfaces/delivery';

import { DeliveryServiceFactory } from '../../factories/delivery-service/delivery-service.factory';

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
            OrderStatus.Cancelled,
            OrderStatus.Fulfilled,
            OrderStatus.Refunded,
          ]),
        ),
      },
      relations: ['delivery'],
    });

    if (!orders || orders.length === 0) {
      return;
    }

    let deliveryStatusesRes: GetDeliveryStatusesResponse = { statuses: [] };

    for (let deliveryServiceName of Object.values(DeliveryService)) {
      const deliveryService =
        this.deliveryServiceFactory.getDeliveryService(deliveryServiceName);

      if (!deliveryService) {
        continue;
      }

      const trackingInfo = orders
        .filter(
          (order) =>
            order.delivery.deliveryService === deliveryServiceName &&
            order.delivery.trackingId,
        )
        .map((order) => ({
          trackingId: order.delivery.trackingId,
        }));

      if (!trackingInfo || trackingInfo.length === 0) {
        continue;
      }

      const statuses = await deliveryService?.getDeliveryStatuses({
        trackingInfo,
      });

      if (statuses) {
        deliveryStatusesRes.statuses.push(...statuses.statuses);
      }
    }

    for (let order of orders) {
      const deliveryStatus = deliveryStatusesRes?.statuses.find(
        (status) => status.trackingId === order.delivery.trackingId,
      );
      if (deliveryStatus) {
        const status = deliveryStatus.status;

        await manager.update(OrderDeliveryEntity, order.delivery.id, {
          status,
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
