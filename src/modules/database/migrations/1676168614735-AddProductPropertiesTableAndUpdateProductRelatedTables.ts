import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProductPropertiesTableAndUpdateProductRelatedTables1676168614735 implements MigrationInterface {
    name = 'AddProductPropertiesTableAndUpdateProductRelatedTables1676168614735'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file" DROP CONSTRAINT "FK_886d5adf189d66bfac37e380d33"`);
        await queryRunner.query(`CREATE TABLE "product_properties" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" character varying NOT NULL, "size" character varying NOT NULL, "color" character varying NOT NULL, "price" numeric(10,2) NOT NULL DEFAULT '0', "productId" integer, CONSTRAINT "UQ_e7e877ad5e4dda89a4e35699821" UNIQUE ("name"), CONSTRAINT "PK_c51d81a7e32d11a7b59c13192cb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_properties_images_file" ("productPropertiesId" integer NOT NULL, "fileId" integer NOT NULL, CONSTRAINT "PK_821011afa9b8116302ed74a26d7" PRIMARY KEY ("productPropertiesId", "fileId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4b84ca78e14dc02cbf0105faf1" ON "product_properties_images_file" ("productPropertiesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_07ad4173381441065a18998fde" ON "product_properties_images_file" ("fileId") `);
        await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "productVariantId"`);
        await queryRunner.query(`ALTER TABLE "product_variant" DROP CONSTRAINT "UQ_6b011a858bfcd83fde87abf1899"`);
        await queryRunner.query(`ALTER TABLE "product_variant" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "product_variant" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "product_variant" DROP COLUMN "size"`);
        await queryRunner.query(`ALTER TABLE "product_variant" DROP COLUMN "color"`);
        await queryRunner.query(`ALTER TABLE "product_variant" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "product_variant" ADD "propertiesId" integer`);
        await queryRunner.query(`ALTER TABLE "product_properties" ADD CONSTRAINT "FK_cffc9e18f85a8d8173e5d835ee3" FOREIGN KEY ("productId") REFERENCES "product_variant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_variant" ADD CONSTRAINT "FK_ecc5f4613300a6899e65721e4f5" FOREIGN KEY ("propertiesId") REFERENCES "product_properties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_properties_images_file" ADD CONSTRAINT "FK_4b84ca78e14dc02cbf0105faf14" FOREIGN KEY ("productPropertiesId") REFERENCES "product_properties"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "product_properties_images_file" ADD CONSTRAINT "FK_07ad4173381441065a18998fdec" FOREIGN KEY ("fileId") REFERENCES "file"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_properties_images_file" DROP CONSTRAINT "FK_07ad4173381441065a18998fdec"`);
        await queryRunner.query(`ALTER TABLE "product_properties_images_file" DROP CONSTRAINT "FK_4b84ca78e14dc02cbf0105faf14"`);
        await queryRunner.query(`ALTER TABLE "product_variant" DROP CONSTRAINT "FK_ecc5f4613300a6899e65721e4f5"`);
        await queryRunner.query(`ALTER TABLE "product_properties" DROP CONSTRAINT "FK_cffc9e18f85a8d8173e5d835ee3"`);
        await queryRunner.query(`ALTER TABLE "product_variant" DROP COLUMN "propertiesId"`);
        await queryRunner.query(`ALTER TABLE "product_variant" ADD "price" numeric(10,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "product_variant" ADD "color" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_variant" ADD "size" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_variant" ADD "description" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_variant" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_variant" ADD CONSTRAINT "UQ_6b011a858bfcd83fde87abf1899" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "file" ADD "productVariantId" integer`);
        await queryRunner.query(`DROP INDEX "public"."IDX_07ad4173381441065a18998fde"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4b84ca78e14dc02cbf0105faf1"`);
        await queryRunner.query(`DROP TABLE "product_properties_images_file"`);
        await queryRunner.query(`DROP TABLE "product_properties"`);
        await queryRunner.query(`ALTER TABLE "file" ADD CONSTRAINT "FK_886d5adf189d66bfac37e380d33" FOREIGN KEY ("productVariantId") REFERENCES "product_variant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
