import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOrderDeliveryStatusEnums1687116168434
  implements MigrationInterface
{
  name = 'UpdateOrderDeliveryStatusEnums1687116168434';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."order_delivery_status_enum" RENAME TO "order_delivery_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."order_delivery_status_enum" AS ENUM('Unspecified', 'Pending', 'Accepted', 'InTransit', 'Arrived', 'Received', 'Returned', 'Declined')`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_delivery" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_delivery" ALTER COLUMN "status" TYPE "public"."order_delivery_status_enum" USING "status"::"text"::"public"."order_delivery_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_delivery" ALTER COLUMN "status" SET DEFAULT 'Pending'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."order_delivery_status_enum_old"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."order_delivery_status_enum_old" AS ENUM('Pending', 'Accepted', 'Processing', 'Sent', 'Received', 'Returned', 'Declined')`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_delivery" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_delivery" ALTER COLUMN "status" TYPE "public"."order_delivery_status_enum_old" USING "status"::"text"::"public"."order_delivery_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_delivery" ALTER COLUMN "status" SET DEFAULT 'Pending'`,
    );
    await queryRunner.query(`DROP TYPE "public"."order_delivery_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."order_delivery_status_enum_old" RENAME TO "order_delivery_status_enum"`,
    );
  }
}
