import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAdminCreatedToNotificationTypeEnum1687640283011
  implements MigrationInterface
{
  name = 'AddAdminCreatedToNotificationTypeEnum1687640283011';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."notification_type_enum" RENAME TO "notification_type_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."notification_type_enum" AS ENUM('info', 'user.created', 'user.confirmed', 'admin.created', 'order.created', 'order.status.updated')`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ALTER COLUMN "type" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ALTER COLUMN "type" TYPE "public"."notification_type_enum" USING "type"::"text"::"public"."notification_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ALTER COLUMN "type" SET DEFAULT 'info'`,
    );
    await queryRunner.query(`DROP TYPE "public"."notification_type_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."notification_type_enum_old" AS ENUM('info', 'user.created', 'user.confirmed', 'order.created', 'order.status.updated')`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ALTER COLUMN "type" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ALTER COLUMN "type" TYPE "public"."notification_type_enum_old" USING "type"::"text"::"public"."notification_type_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ALTER COLUMN "type" SET DEFAULT 'info'`,
    );
    await queryRunner.query(`DROP TYPE "public"."notification_type_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."notification_type_enum_old" RENAME TO "notification_type_enum"`,
    );
  }
}
