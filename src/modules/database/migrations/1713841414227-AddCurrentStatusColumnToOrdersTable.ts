import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCurrentStatusColumnToOrdersTable1713841414227 implements MigrationInterface {
    name = 'AddCurrentStatusColumnToOrdersTable1713841414227'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."order_currentstatus_enum" AS ENUM('Pending', 'Processing', 'TransferedToDelivery', 'Fulfilled', 'Cancelled', 'Refunded', 'Refused')`);
        await queryRunner.query(`ALTER TABLE "order" ADD "currentStatus" "public"."order_currentstatus_enum" NOT NULL DEFAULT 'Pending'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "currentStatus"`);
        await queryRunner.query(`DROP TYPE "public"."order_currentstatus_enum"`);
    }

}
