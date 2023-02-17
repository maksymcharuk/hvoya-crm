import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFileForeignKeyToOrderDelivery1676512753879 implements MigrationInterface {
    name = 'AddFileForeignKeyToOrderDelivery1676512753879'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_delivery" ADD "waybillId" integer`);
        await queryRunner.query(`ALTER TABLE "order_delivery" ADD CONSTRAINT "UQ_c7d42fb3ea671da309d0d105dc4" UNIQUE ("waybillId")`);
        await queryRunner.query(`ALTER TABLE "order_delivery" ADD CONSTRAINT "FK_c7d42fb3ea671da309d0d105dc4" FOREIGN KEY ("waybillId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_delivery" DROP CONSTRAINT "FK_c7d42fb3ea671da309d0d105dc4"`);
        await queryRunner.query(`ALTER TABLE "order_delivery" DROP CONSTRAINT "UQ_c7d42fb3ea671da309d0d105dc4"`);
        await queryRunner.query(`ALTER TABLE "order_delivery" DROP COLUMN "waybillId"`);
    }

}
