import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOrderStatusRefused1692395145186 implements MigrationInterface {
    name = 'AddOrderStatusRefused1692395145186'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."order_status_status_enum" RENAME TO "order_status_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."order_status_status_enum" AS ENUM('Pending', 'Processing', 'TransferedToDelivery', 'Fulfilled', 'Cancelled', 'Refunded', 'Refused')`);
        await queryRunner.query(`ALTER TABLE "order_status" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "order_status" ALTER COLUMN "status" TYPE "public"."order_status_status_enum" USING "status"::"text"::"public"."order_status_status_enum"`);
        await queryRunner.query(`ALTER TABLE "order_status" ALTER COLUMN "status" SET DEFAULT 'Pending'`);
        await queryRunner.query(`DROP TYPE "public"."order_status_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."order_status_status_enum_old" AS ENUM('Pending', 'Processing', 'Packaging', 'TransferedToDelivery', 'Fulfilled', 'Cancelled', 'Refunded')`);
        await queryRunner.query(`ALTER TABLE "order_status" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "order_status" ALTER COLUMN "status" TYPE "public"."order_status_status_enum_old" USING "status"::"text"::"public"."order_status_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "order_status" ALTER COLUMN "status" SET DEFAULT 'Pending'`);
        await queryRunner.query(`DROP TYPE "public"."order_status_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."order_status_status_enum_old" RENAME TO "order_status_status_enum"`);
    }

}
