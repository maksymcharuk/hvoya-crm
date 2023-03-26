import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddWeightColumnToProductPropertiesTable1679859507428
  implements MigrationInterface
{
  name = 'AddWeightColumnToProductPropertiesTable1679859507428';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_properties" ADD "weight" numeric(10,2) NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_properties" DROP COLUMN "weight"`,
    );
  }
}
