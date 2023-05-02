import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddWebsiteColumnToUser1682992608606 implements MigrationInterface {
  name = 'AddWebsiteColumnToUser1682992608606';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "website" character varying NOT NULL DEFAULT ''`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "website"`);
  }
}
