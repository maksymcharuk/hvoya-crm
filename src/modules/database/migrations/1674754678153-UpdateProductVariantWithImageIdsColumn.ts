import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateProductVariantWithImageIdsColumn1674754678153 implements MigrationInterface {
    name = 'UpdateProductVariantWithImageIdsColumn1674754678153'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_variant" ADD "imageIds" text array`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_variant" DROP COLUMN "imageIds"`);
    }

}
