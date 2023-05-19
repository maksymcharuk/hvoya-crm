import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNumberColumnToOrderTable1684458888318
  implements MigrationInterface
{
  name = 'AddNumberColumnToOrderTable1684458888318';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" 
        ADD "number" character varying,
        ADD CONSTRAINT "UQ_2bf21e468cc540c1ac7645da264" UNIQUE ("number")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" 
        DROP CONSTRAINT "UQ_2bf21e468cc540c1ac7645da264",
        DROP COLUMN "number"`,
    );
  }
}
