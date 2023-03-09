import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOrderStatusEnum1678342677901 implements MigrationInterface {
  name = 'UpdateOrderStatusEnum1678342677901';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."order_status_enum" RENAME TO "order_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."order_status_enum" AS ENUM('Pending', 'Processing', 'TransferedToDelivery', 'Fulfilled', 'Cancelled', 'Refunded')`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "status" TYPE "public"."order_status_enum" USING "status"::"text"::"public"."order_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "status" SET DEFAULT 'Pending'`,
    );
    await queryRunner.query(`DROP TYPE "public"."order_status_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."order_status_enum_old" AS ENUM('Pending', 'Processing', 'Fulfilled', 'Cancelled', 'Refunded')`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "status" TYPE "public"."order_status_enum_old" USING "status"::"text"::"public"."order_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "status" SET DEFAULT 'Pending'`,
    );
    await queryRunner.query(`DROP TYPE "public"."order_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."order_status_enum_old" RENAME TO "order_status_enum"`,
    );
  }
}
