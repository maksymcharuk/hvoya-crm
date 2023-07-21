import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProductPackageSizeTable1690255148273
  implements MigrationInterface
{
  name = 'AddProductPackageSizeTable1690255148273';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "product_package_size" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "height" integer NOT NULL DEFAULT '0', "width" integer NOT NULL DEFAULT '0', "depth" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_60d80284e120e091f13b8e5f977" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_size" DROP COLUMN "packageHeight"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_size" DROP COLUMN "packageWidth"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_size" DROP COLUMN "packageDepth"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties" ADD "packageSizeId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties" ADD CONSTRAINT "FK_58307ae2b57d91aab168b7f4e90" FOREIGN KEY ("packageSizeId") REFERENCES "product_package_size"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_properties" DROP CONSTRAINT "FK_58307ae2b57d91aab168b7f4e90"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties" DROP COLUMN "packageSizeId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_size" ADD "packageDepth" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_size" ADD "packageWidth" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_size" ADD "packageHeight" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(`DROP TABLE "product_package_size"`);
  }
}
