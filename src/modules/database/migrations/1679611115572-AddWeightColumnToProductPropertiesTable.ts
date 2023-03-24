import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddWeightColumnToProductPropertiesTable1679611115572
  implements MigrationInterface
{
  name = 'AddWeightColumnToProductPropertiesTable1679611115572';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_properties" ADD "weight" integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_properties" DROP COLUMN "weight"`,
    );
  }
}
