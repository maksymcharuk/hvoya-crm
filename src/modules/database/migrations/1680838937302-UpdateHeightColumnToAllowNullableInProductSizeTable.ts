import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateHeightColumnToAllowNullableInProductSizeTable1680838937302
  implements MigrationInterface
{
  name = 'UpdateHeightColumnToAllowNullableInProductSizeTable1680838937302';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_size" ALTER COLUMN "height" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_size" ALTER COLUMN "height" SET NOT NULL`,
    );
  }
}
