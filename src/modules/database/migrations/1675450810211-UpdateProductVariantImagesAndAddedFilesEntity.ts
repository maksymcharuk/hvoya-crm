import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateProductVariantImagesAndAddedFilesEntity1675450810211
  implements MigrationInterface
{
  name = 'UpdateProductVariantImagesAndAddedFilesEntity1675450810211';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "file" (
        "id" SERIAL NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), 
        "public_id" character varying NOT NULL,
        "url" character varying NOT NULL,
        "productVariantId" integer,
        CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variant" 
        DROP COLUMN "imageIds"`,
    );
    await queryRunner.query(
      `ALTER TABLE "file" 
        ADD CONSTRAINT "FK_886d5adf189d66bfac37e380d33" 
        FOREIGN KEY ("productVariantId") 
        REFERENCES "product_variant"("id") 
        ON DELETE NO ACTION 
        ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "file" 
        DROP CONSTRAINT "FK_886d5adf189d66bfac37e380d33"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variant" 
        ADD "imageIds" text array`,
    );
    await queryRunner.query(`DROP TABLE "file"`);
  }
}
