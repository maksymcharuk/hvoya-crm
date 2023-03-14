import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDeliveryServiceToOrderDeliveryTable1678764993213
  implements MigrationInterface
{
  name = 'AddDeliveryServiceToOrderDeliveryTable1678764993213';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."order_delivery_deliveryservice_enum" AS ENUM('NovaPoshta', 'UkrPoshta')`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_delivery" ADD "deliveryService" "public"."order_delivery_deliveryservice_enum"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_delivery" DROP COLUMN "deliveryService"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."order_delivery_deliveryservice_enum"`,
    );
  }
}
