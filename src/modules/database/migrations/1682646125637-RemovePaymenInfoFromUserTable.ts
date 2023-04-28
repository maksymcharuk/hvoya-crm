import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemovePaymenInfoFromUserTable1682646125637
  implements MigrationInterface
{
  name = 'RemovePaymenInfoFromUserTable1682646125637';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user" 
        DROP COLUMN "cardNumber",
        DROP COLUMN "cardholderName"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" 
        ADD "cardholderName" character varying NOT NULL DEFAULT '',
        ADD "cardNumber" character varying NOT NULL DEFAULT ''`,
    );
  }
}
