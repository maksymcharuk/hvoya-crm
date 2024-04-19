import { MigrationInterface, QueryRunner } from 'typeorm';

import { OrderDeliveryEntity } from '../../../entities/order-delivery.entity';
import { OrderEntity } from '../../../entities/order.entity';
import { DeliveryStatus } from '../../../enums/delivery-status.enum';
import { OrderStatus } from '../../../enums/order-status.enum';

export class UpdateOrderDevlieryStatusesToBeConsistentWithOrderStatuses1689285413653
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // update orders delivery status to match order status
    const orders = await queryRunner.manager.find(OrderEntity, {
      select: {
        id: true,
        delivery: {
          id: true,
        },
        statuses: {
          status: true,
        },
      },
      relations: ['statuses', 'delivery'],
      order: {
        statuses: {
          createdAt: 'DESC',
        },
      },
    });
    const fulfilledOrders = orders.filter(
      (order) => order.statuses[0]?.status === OrderStatus.Fulfilled,
    );
    const cancelledOrders = orders.filter(
      (order) => order.statuses[0]?.status === OrderStatus.Cancelled,
    );
    const refundedOrders = orders.filter(
      (order) => order.statuses[0]?.status === OrderStatus.Refunded,
    );

    for (let order of fulfilledOrders) {
      await queryRunner.manager.save(OrderDeliveryEntity, {
        id: order.delivery.id,
        status: DeliveryStatus.Received,
      });
    }
    for (let order of cancelledOrders) {
      await queryRunner.manager.save(OrderDeliveryEntity, {
        id: order.delivery.id,
        status: DeliveryStatus.Declined,
      });
    }
    for (let order of refundedOrders) {
      await queryRunner.manager.save(OrderDeliveryEntity, {
        id: order.delivery.id,
        status: DeliveryStatus.Returned,
      });
    }
  }

  public async down(): Promise<void> {}
}
