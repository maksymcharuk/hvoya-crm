import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProfileFieldsToUserTable1674444546307
  implements MigrationInterface
{
  name = 'AddProfileFieldsToUserTable1674444546307';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" 
        ADD "phoneNumber" character varying NOT NULL DEFAULT '',
        ADD "location" character varying NOT NULL DEFAULT '',
        ADD "bio" character varying NOT NULL DEFAULT '',
        ADD "cardNumber" character varying NOT NULL DEFAULT '',
        ADD "cardholderName" character varying NOT NULL DEFAULT ''`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" 
        DROP COLUMN "cardholderName",
        DROP COLUMN "cardNumber",
        DROP COLUMN "bio",
        DROP COLUMN "location",
        DROP COLUMN "phoneNumber"`,
    );
  }
}
