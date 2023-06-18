import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateMessageColumnInNotificationEntityToAllowNull1687037922289
  implements MigrationInterface
{
  name = 'UpdateMessageColumnInNotificationEntityToAllowNull1687037922289';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification" ALTER COLUMN "message" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification" ALTER COLUMN "message" SET NOT NULL`,
    );
  }
}
