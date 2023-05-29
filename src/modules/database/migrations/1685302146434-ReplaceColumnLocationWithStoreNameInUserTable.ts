import { MigrationInterface, QueryRunner } from 'typeorm';

export class ReplaceColumnLocationWithStoreNameInUserTable1685302146434
  implements MigrationInterface
{
  name = 'ReplaceColumnLocationWithStoreNameInUserTable1685302146434';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" RENAME COLUMN "location" TO "storeName"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" RENAME COLUMN "storeName" TO "location"`,
    );
  }
}
