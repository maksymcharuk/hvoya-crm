import { MigrationInterface, QueryRunner } from "typeorm";

export class AddReceiverColumnsToOrderDeliveryTable1676503617917 implements MigrationInterface {
    name = 'AddReceiverColumnsToOrderDeliveryTable1676503617917'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_delivery" ADD "email" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "order_delivery" ADD "firstName" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "order_delivery" ADD "lastName" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "order_delivery" ADD "middleName" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "order_delivery" ADD "phoneNumber" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "order_delivery" ADD "deliveryType" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "order_delivery" ADD "city" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "order_delivery" ADD "postOffice" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_delivery" DROP COLUMN "postOffice"`);
        await queryRunner.query(`ALTER TABLE "order_delivery" DROP COLUMN "city"`);
        await queryRunner.query(`ALTER TABLE "order_delivery" DROP COLUMN "deliveryType"`);
        await queryRunner.query(`ALTER TABLE "order_delivery" DROP COLUMN "phoneNumber"`);
        await queryRunner.query(`ALTER TABLE "order_delivery" DROP COLUMN "middleName"`);
        await queryRunner.query(`ALTER TABLE "order_delivery" DROP COLUMN "lastName"`);
        await queryRunner.query(`ALTER TABLE "order_delivery" DROP COLUMN "firstName"`);
        await queryRunner.query(`ALTER TABLE "order_delivery" DROP COLUMN "email"`);
    }

}
