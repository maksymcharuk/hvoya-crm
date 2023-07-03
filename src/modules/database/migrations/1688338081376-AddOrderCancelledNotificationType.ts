import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOrderCancelledNotificationType1688338081376 implements MigrationInterface {
    name = 'AddOrderCancelledNotificationType1688338081376'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."notification_type_enum" RENAME TO "notification_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."notification_type_enum" AS ENUM('info', 'user.created', 'user.confirmed', 'admin.created', 'order.created', 'order.cancelled', 'order.status.updated')`);
        await queryRunner.query(`ALTER TABLE "notification" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "notification" ALTER COLUMN "type" TYPE "public"."notification_type_enum" USING "type"::"text"::"public"."notification_type_enum"`);
        await queryRunner.query(`ALTER TABLE "notification" ALTER COLUMN "type" SET DEFAULT 'info'`);
        await queryRunner.query(`DROP TYPE "public"."notification_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."notification_type_enum_old" AS ENUM('info', 'user.created', 'user.confirmed', 'admin.created', 'order.created', 'order.status.updated')`);
        await queryRunner.query(`ALTER TABLE "notification" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "notification" ALTER COLUMN "type" TYPE "public"."notification_type_enum_old" USING "type"::"text"::"public"."notification_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "notification" ALTER COLUMN "type" SET DEFAULT 'info'`);
        await queryRunner.query(`DROP TYPE "public"."notification_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."notification_type_enum_old" RENAME TO "notification_type_enum"`);
    }

}
