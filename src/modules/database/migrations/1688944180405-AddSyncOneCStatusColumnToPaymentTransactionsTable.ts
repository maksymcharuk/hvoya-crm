import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSyncOneCStatusColumnToPaymentTransactionsTable1688944180405
  implements MigrationInterface
{
  name = 'AddSyncOneCStatusColumnToPaymentTransactionsTable1688944180405';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."payment_transaction_synconecstatus_enum" AS ENUM('Pending', 'Success', 'Failed')`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" ADD "syncOneCStatus" "public"."payment_transaction_synconecstatus_enum" NOT NULL DEFAULT 'Pending'`,
    );
    // set success status for all existing successful transactions and pending status for all other transactions
    await queryRunner.query(
      `UPDATE "payment_transaction" SET "syncOneCStatus" = 'Success' WHERE "status" = 'Success'`,
    );
    await queryRunner.query(
      `UPDATE "payment_transaction" SET "syncOneCStatus" = 'Pending' WHERE "status" != 'Success'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" DROP COLUMN "syncOneCStatus"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."payment_transaction_synconecstatus_enum"`,
    );
  }
}
