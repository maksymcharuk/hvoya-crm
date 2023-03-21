import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateDeliveryTypeColumnInOrderTable1679368260164
  implements MigrationInterface
{
  name = 'UpdateDeliveryTypeColumnInOrderTable1679368260164';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_delivery" DROP COLUMN "deliveryType"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."order_delivery_deliverytype_enum" AS ENUM('WarehouseWarehouse', 'WarehouseDoor')`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_delivery" ADD "deliveryType" "public"."order_delivery_deliverytype_enum"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_delivery" DROP COLUMN "deliveryType"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."order_delivery_deliverytype_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_delivery" ADD "deliveryType" character varying NOT NULL DEFAULT ''`,
    );
  }
}
