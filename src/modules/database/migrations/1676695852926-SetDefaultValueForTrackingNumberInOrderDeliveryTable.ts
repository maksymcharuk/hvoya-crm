import { MigrationInterface, QueryRunner } from 'typeorm';

export class SetDefaultValueForTrackingNumberInOrderDeliveryTable1676695852926
  implements MigrationInterface
{
  name = 'SetDefaultValueForTrackingNumberInOrderDeliveryTable1676695852926';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_delivery" 
        ALTER COLUMN "trackingId" SET DEFAULT ''`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_delivery" 
        ALTER COLUMN "trackingId" DROP DEFAULT`,
    );
  }
}
