import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSelfPickupToDeliveryServiceType1698450332066
  implements MigrationInterface
{
  name = 'AddSelfPickupToDeliveryServiceType1698450332066';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."order_delivery_deliveryservice_enum" RENAME TO "order_delivery_deliveryservice_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."order_delivery_deliveryservice_enum" AS ENUM('SelfPickup', 'NovaPoshta', 'UkrPoshta')`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_delivery" ALTER COLUMN "deliveryService" TYPE "public"."order_delivery_deliveryservice_enum" USING "deliveryService"::"text"::"public"."order_delivery_deliveryservice_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."order_delivery_deliveryservice_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."order_return_delivery_deliveryservice_enum" RENAME TO "order_return_delivery_deliveryservice_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."order_return_delivery_deliveryservice_enum" AS ENUM('SelfPickup', 'NovaPoshta', 'UkrPoshta')`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_return_delivery" ALTER COLUMN "deliveryService" TYPE "public"."order_return_delivery_deliveryservice_enum" USING "deliveryService"::"text"::"public"."order_return_delivery_deliveryservice_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."order_return_delivery_deliveryservice_enum_old"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."order_return_delivery_deliveryservice_enum_old" AS ENUM('NovaPoshta', 'UkrPoshta')`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_return_delivery" ALTER COLUMN "deliveryService" TYPE "public"."order_return_delivery_deliveryservice_enum_old" USING "deliveryService"::"text"::"public"."order_return_delivery_deliveryservice_enum_old"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."order_return_delivery_deliveryservice_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."order_return_delivery_deliveryservice_enum_old" RENAME TO "order_return_delivery_deliveryservice_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."order_delivery_deliveryservice_enum_old" AS ENUM('NovaPoshta', 'UkrPoshta')`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_delivery" ALTER COLUMN "deliveryService" TYPE "public"."order_delivery_deliveryservice_enum_old" USING "deliveryService"::"text"::"public"."order_delivery_deliveryservice_enum_old"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."order_delivery_deliveryservice_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."order_delivery_deliveryservice_enum_old" RENAME TO "order_delivery_deliveryservice_enum"`,
    );
  }
}
