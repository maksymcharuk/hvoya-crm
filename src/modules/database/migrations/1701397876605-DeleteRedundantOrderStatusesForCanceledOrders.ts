import { MigrationInterface, QueryRunner } from 'typeorm';

import { OrderStatusEntity } from '../../../entities/order-status.entity';
import { OrderEntity } from '../../../entities/order.entity';
import { SortOrder } from '../../../enums/sort-order.enum';

export class DeleteRedundantOrderStatusesForCanceledOrders1701397876605
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const order = await queryRunner.manager.findOne(OrderEntity, {
      where: { number: '1936' },
      select: ['id'],
    });

    if (!order) {
      return;
    }

    const status = await queryRunner.manager
      .createQueryBuilder(OrderStatusEntity, 'status')
      .where({ order: { id: order!.id } })
      .select(['status.id', 'status.createdAt'])
      .orderBy('status.createdAt', SortOrder.DESC)
      .getOne();

    if (!status) {
      return;
    }

    await queryRunner.manager.delete(OrderStatusEntity, status.id);
  }

  public async down(): Promise<void> {}
}
