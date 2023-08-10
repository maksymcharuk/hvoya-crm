import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPaymentTransactionToReturnRequest1691693604655 implements MigrationInterface {
    name = 'AddPaymentTransactionToReturnRequest1691693604655'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_transaction" ADD "orderReturnRequestId" uuid`);
        await queryRunner.query(`ALTER TABLE "payment_transaction" ADD CONSTRAINT "FK_61c87e1fd3fb8397ee38715509f" FOREIGN KEY ("orderReturnRequestId") REFERENCES "order_return_request"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_transaction" DROP CONSTRAINT "FK_61c87e1fd3fb8397ee38715509f"`);
        await queryRunner.query(`ALTER TABLE "payment_transaction" DROP COLUMN "orderReturnRequestId"`);
    }

}
