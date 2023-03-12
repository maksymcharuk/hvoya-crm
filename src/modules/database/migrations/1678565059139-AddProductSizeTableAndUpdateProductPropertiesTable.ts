import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProductSizeTableAndUpdateProductPropertiesTable1678565059139
  implements MigrationInterface
{
  name = 'AddProductSizeTableAndUpdateProductPropertiesTable1678565059139';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_properties" RENAME COLUMN "size" TO "sizeId"`,
    );
    await queryRunner.query(
      `CREATE TABLE "product_size" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "height" integer NOT NULL, "width" integer, "depth" integer, "diameter" integer, "packageHeight" integer NOT NULL, "packageWidth" integer NOT NULL, "packageDepth" integer NOT NULL, CONSTRAINT "PK_3210db31599e5c505183be05896" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties" DROP COLUMN "sizeId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties" ADD "sizeId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties" ADD CONSTRAINT "FK_d1e09d6e586e4441a30e6cc0229" FOREIGN KEY ("sizeId") REFERENCES "product_size"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_properties" DROP CONSTRAINT "FK_d1e09d6e586e4441a30e6cc0229"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties" DROP COLUMN "sizeId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties" ADD "sizeId" character varying NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "product_size"`);
    await queryRunner.query(
      `ALTER TABLE "product_properties" RENAME COLUMN "sizeId" TO "size"`,
    );
  }
}
