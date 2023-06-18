import { DataSource } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { OrderDeliveryEntity } from '@entities/order-delivery.entity';
import { OrderStatusEntity } from '@entities/order-status.entity';
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

  // Map delivery statuses to order statuses
  private readonly deliveryStatusesToOrderStatuses = new Map<
    OrderDeliveryStatus[],
    OrderStatus
  >([
    [
      [
        OrderDeliveryStatus.Declined,
        OrderDeliveryStatus.Received,
        OrderDeliveryStatus.Returned,
      ],
      OrderStatus.Fulfilled,
    ],
    [
      [
        OrderDeliveryStatus.Accepted,
        OrderDeliveryStatus.InTransit,
        OrderDeliveryStatus.Arrived,
      ],
      OrderStatus.TransferedToDelivery,
    ],
  ]);

  @Cron(CronExpression.EVERY_HOUR)
  async updateOrderDeliveryStatuses() {
    const manager = this.dataSource.createEntityManager();

    // Get all orders where the latest status is not completed
    const orders = await manager
      .createQueryBuilder(OrderEntity, 'order')
      .leftJoinAndSelect('order.statuses', 'status')
      .leftJoinAndSelect('order.delivery', 'delivery')
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .from(OrderStatusEntity, 'status')
          .select('MAX(status.createdAt)', 'maxCreatedAt')
          .where('status.orderId = order.id')
          .groupBy('status.orderId')
          .getQuery();

        return `status.createdAt = (${subQuery})`;
      })
      .andWhere('status.status NOT IN (:...completedStatuses)', {
        completedStatuses: [
          OrderStatus.Cancelled,
          OrderStatus.Fulfilled,
          OrderStatus.Refunded,
        ],
      })
      .getMany();

    // If no orders to update delivery statuses for, return
    if (!orders || orders.length === 0) {
      return;
    }

    // Get delivery statuses for all orders base on delivery service
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

    // Update delivery statuses for orders
    for (let order of orders) {
      const deliveryStatus = deliveryStatusesRes?.statuses.find(
        (status) => status.trackingId === order.delivery.trackingId,
      );
      // If delivery status for order is not found, skip
      if (!deliveryStatus) {
        continue;
      }
      const status = deliveryStatus.status;
      await manager.update(OrderDeliveryEntity, order.delivery.id, {
        status: deliveryStatus.status,
        rawStatus: deliveryStatus.rawStatus,
      });
      await this.updateOrderStatus(status, order);
    }
  }

  private async updateOrderStatus(
    currentDeliveryStatus: OrderDeliveryStatus,
    order: OrderEntity,
  ) {
    const manager = this.dataSource.createEntityManager();
    this.deliveryStatusesToOrderStatuses.forEach(async (value, key) => {
      if (key.includes(currentDeliveryStatus)) {
        // Create new status only if it is not the same as the latest one
        if (order.statuses[order.statuses.length - 1]?.status === value) {
          return;
        }

        const newStatus = await manager.save(OrderStatusEntity, {
          status: value,
          comment: 'Оновлено автоматично',
          order: { id: order.id },
        });
        await manager.save(OrderEntity, {
          id: order.id,
          statuses: [...order.statuses, newStatus],
        });
      }
    });
  }
}
