import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTypeColumnInNotificationsTableToUseEnums1686947090991
  implements MigrationInterface
{
  name = 'UpdateTypeColumnInNotificationsTableToUseEnums1686947090991';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "type"`);
    await queryRunner.query(
      `CREATE TYPE "public"."notification_type_enum" AS ENUM('info', 'user.created', 'user.confirmed', 'order.created', 'order.status.updated')`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD "type" "public"."notification_type_enum" NOT NULL DEFAULT 'info'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "type"`);
    await queryRunner.query(`DROP TYPE "public"."notification_type_enum"`);
    await queryRunner.query(
      `ALTER TABLE "notification" ADD "type" character varying NOT NULL DEFAULT 'info'`,
    );
  }
}
