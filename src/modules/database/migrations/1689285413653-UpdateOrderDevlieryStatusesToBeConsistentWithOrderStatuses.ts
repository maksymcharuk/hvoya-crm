import { MigrationInterface, QueryRunner } from 'typeorm';

import { OrderDeliveryEntity } from '../../../entities/order-delivery.entity';
import { OrderEntity } from '../../../entities/order.entity';
import { OrderDeliveryStatus } from '../../../enums/order-delivery-status.enum';
import { OrderStatus } from '../../../enums/order-status.enum';

export class UpdateOrderDevlieryStatusesToBeConsistentWithOrderStatuses1689285413653
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // update orders delivery status to match order status
    const orders = await queryRunner.manager.find(OrderEntity, {
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
        status: OrderDeliveryStatus.Received,
      });
    }
    for (let order of cancelledOrders) {
      await queryRunner.manager.save(OrderDeliveryEntity, {
        id: order.delivery.id,
        status: OrderDeliveryStatus.Declined,
      });
    }
    for (let order of refundedOrders) {
      await queryRunner.manager.save(OrderDeliveryEntity, {
        id: order.delivery.id,
        status: OrderDeliveryStatus.Returned,
      });
    }
  }

  public async down(): Promise<void> {}
}
