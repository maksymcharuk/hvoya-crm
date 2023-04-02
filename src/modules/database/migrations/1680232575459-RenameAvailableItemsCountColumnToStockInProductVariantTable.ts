import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameAvailableItemsCountColumnToStockInProductVariantTable1680232575459
  implements MigrationInterface
{
  name =
    'RenameAvailableItemsCountColumnToStockInProductVariantTable1680232575459';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_variant" RENAME COLUMN "availableItemCount" TO "stock"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_variant" RENAME COLUMN "stock" TO "availableItemCount"`,
    );
  }
}
