import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProductColorTableAndUpdateProductPropertiesTable1678511384742
  implements MigrationInterface
{
  name = 'AddProductColorTableAndUpdateProductPropertiesTable1678511384742';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_properties" RENAME COLUMN "color" TO "colorId"`,
    );
    await queryRunner.query(
      `CREATE TABLE "product_color" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "hex" character varying NOT NULL, CONSTRAINT "UQ_51915fefa90b7bca52573bc2353" UNIQUE ("name"), CONSTRAINT "UQ_65fe7dec4396b8cf5ac03213aa3" UNIQUE ("hex"), CONSTRAINT "PK_e586d22a197c9b985af3ac82ce3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties" DROP COLUMN "colorId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties" ADD "colorId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties" ADD CONSTRAINT "FK_e52944a42e0586566220c14dffe" FOREIGN KEY ("colorId") REFERENCES "product_color"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_properties" DROP CONSTRAINT "FK_e52944a42e0586566220c14dffe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties" DROP COLUMN "colorId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties" ADD "colorId" character varying NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "product_color"`);
    await queryRunner.query(
      `ALTER TABLE "product_properties" RENAME COLUMN "colorId" TO "color"`,
    );
  }
}
