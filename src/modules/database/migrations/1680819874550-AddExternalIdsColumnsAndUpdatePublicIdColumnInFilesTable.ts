import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddExternalIdsColumnsAndUpdatePublicIdColumnInFilesTable1680819874550
  implements MigrationInterface
{
  name =
    'AddExternalIdsColumnsAndUpdatePublicIdColumnInFilesTable1680819874550';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_category" ADD "externalIds" text array NOT NULL DEFAULT '{}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_base" ADD "externalIds" text array NOT NULL DEFAULT '{}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variant" ADD "externalIds" text array NOT NULL DEFAULT '{}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "file" ALTER COLUMN "public_id" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "file" ALTER COLUMN "public_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variant" DROP COLUMN "externalIds"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_base" DROP COLUMN "externalIds"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_category" DROP COLUMN "externalIds"`,
    );
  }
}
