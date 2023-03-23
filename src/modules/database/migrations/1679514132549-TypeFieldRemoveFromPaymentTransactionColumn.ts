import { MigrationInterface, QueryRunner } from "typeorm";

export class TypeFieldRemoveFromPaymentTransactionColumn1679514132549 implements MigrationInterface {
    name = 'TypeFieldRemoveFromPaymentTransactionColumn1679514132549'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_transaction" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."payment_transaction_status_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."payment_transaction_status_enum" AS ENUM('Pending', 'Processing', 'Completed', 'Failed')`);
        await queryRunner.query(`ALTER TABLE "payment_transaction" ADD "status" "public"."payment_transaction_status_enum" NOT NULL DEFAULT 'Pending'`);
    }

}
