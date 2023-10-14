import { MigrationInterface, QueryRunner } from 'typeorm';

import { OrderReturnRequestEntity } from '../../../entities/order-return-request.entity';
import { OrderStatusEntity } from '../../../entities/order-status.entity';
import { OrderStatus } from '../../../enums/order-status.enum';

export class SetReturnStatusToOrdersWhereReturnRequestWasCreated1697226299244
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const orderReturnRequests = await queryRunner.manager.find(
      OrderReturnRequestEntity,
      {
        relations: ['order'],
      },
    );

    for (const orderReturnRequest of orderReturnRequests) {
      await queryRunner.manager.save(OrderStatusEntity, {
        status: OrderStatus.Refunded,
        comment: 'Замовлення поністю або частково повернено клієнтом',
        order: { id: orderReturnRequest.order.id },
        createdAt: orderReturnRequest.updatedAt,
      });
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.delete(OrderStatusEntity, {
      status: OrderStatus.Refunded,
    });
  }
}
