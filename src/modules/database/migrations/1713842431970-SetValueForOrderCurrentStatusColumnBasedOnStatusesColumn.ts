import { MigrationInterface, QueryRunner } from 'typeorm';

import { OrderEntity } from '../../../entities/order.entity';

export class SetValueForOrderCurrentStatusColumnBasedOnStatusesColumn1713842431970
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Set current status for all orders base on the last status in the statuses relation array and cast "public"."order_status_enum" for status column
    const orders = await queryRunner.manager.find(OrderEntity, {
      select: {
        id: true,
        statuses: {
          id: true,
          status: true,
          createdAt: true,
        },
      },
      relations: ['statuses'],
    });
    for (const order of orders) {
      const lastStatus = order.statuses.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
      )[0];
      if (!lastStatus) {
        continue;
      }
      order.currentStatus = lastStatus.status;
    }
    await queryRunner.manager.save(orders);
  }

  public async down(): Promise<void> {}
}
