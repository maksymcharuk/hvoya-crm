import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrderStatusPackagingAndUpdateRelatedColumn1682994349719
  implements MigrationInterface
{
  name = 'AddOrderStatusPackagingAndUpdateRelatedColumn1682994349719';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."order_status_enum" RENAME TO "order_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."order_status_enum" AS ENUM('Pending', 'Processing', 'Packaging', 'TransferedToDelivery', 'Fulfilled', 'Cancelled', 'Refunded')`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" 
        ALTER COLUMN "status" DROP DEFAULT,
        ALTER COLUMN "status" TYPE "public"."order_status_enum" USING "status"::"text"::"public"."order_status_enum",
        ALTER COLUMN "status" SET DEFAULT 'Pending'`,
    );
    await queryRunner.query(`DROP TYPE "public"."order_status_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."order_status_enum_old" AS ENUM('Pending', 'Processing', 'TransferedToDelivery', 'Fulfilled', 'Cancelled', 'Refunded')`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" 
        ALTER COLUMN "status" DROP DEFAULT,
        ALTER COLUMN "status" TYPE "public"."order_status_enum_old" USING "status"::"text"::"public"."order_status_enum_old",
        ALTER COLUMN "status" SET DEFAULT 'Pending'`,
    );
    await queryRunner.query(`DROP TYPE "public"."order_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."order_status_enum_old" RENAME TO "order_status_enum"`,
    );
  }
}
