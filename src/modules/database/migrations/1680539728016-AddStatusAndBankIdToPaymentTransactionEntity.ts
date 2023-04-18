import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStatusAndBankIdToPaymentTransactionEntity1680539728016 implements MigrationInterface {
    name = 'AddStatusAndBankIdToPaymentTransactionEntity1680539728016'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."payment_transaction_status_enum" AS ENUM('Pending', 'Success', 'Canceled', 'Failed')`);
        await queryRunner.query(`ALTER TABLE "payment_transaction" ADD "status" "public"."payment_transaction_status_enum" NOT NULL DEFAULT 'Pending'`);
        await queryRunner.query(`ALTER TABLE "payment_transaction" ADD "bankTransactionId" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_transaction" DROP COLUMN "bankTransactionId"`);
        await queryRunner.query(`ALTER TABLE "payment_transaction" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."payment_transaction_status_enum"`);
    }

}
