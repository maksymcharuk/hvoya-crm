import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateAllColumnsToSetDefaultInProductSizesTable1680921158931
  implements MigrationInterface
{
  name = 'UpdateAllColumnsToSetDefaultInProductSizesTable1680921158931';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "product_size"
        ALTER COLUMN "height" SET NOT NULL,
        ALTER COLUMN "height" SET DEFAULT '0',
        ALTER COLUMN "width" SET NOT NULL,
        ALTER COLUMN "width" SET DEFAULT '0',
        ALTER COLUMN "depth" SET NOT NULL,
        ALTER COLUMN "depth" SET DEFAULT '0',
        ALTER COLUMN "diameter" SET NOT NULL,
        ALTER COLUMN "diameter" SET DEFAULT '0',
        ALTER COLUMN "packageHeight" SET NOT NULL,
        ALTER COLUMN "packageHeight" SET DEFAULT '0',
        ALTER COLUMN "packageWidth" SET NOT NULL,
        ALTER COLUMN "packageWidth" SET DEFAULT '0',
        ALTER COLUMN "packageDepth" SET NOT NULL,
        ALTER COLUMN "packageDepth" SET DEFAULT '0'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "product_size"
        ALTER COLUMN "packageDepth" DROP DEFAULT,
        ALTER COLUMN "packageDepth" DROP NOT NULL,
        ALTER COLUMN "packageWidth" DROP DEFAULT,
        ALTER COLUMN "packageWidth" DROP NOT NULL,
        ALTER COLUMN "packageHeight" DROP DEFAULT,
        ALTER COLUMN "packageHeight" DROP NOT NULL,
        ALTER COLUMN "diameter" DROP DEFAULT,
        ALTER COLUMN "diameter" DROP NOT NULL,
        ALTER COLUMN "depth" DROP DEFAULT,
        ALTER COLUMN "depth" DROP NOT NULL,
        ALTER COLUMN "width" DROP DEFAULT,
        ALTER COLUMN "width" DROP NOT NULL,
        ALTER COLUMN "height" DROP DEFAULT,
        ALTER COLUMN "height" DROP NOT NULL`);
  }
}
