import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsPublishedColumnToProductPropertiesTable1683086858010 implements MigrationInterface {
    name = 'AddIsPublishedColumnToProductPropertiesTable1683086858010'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_properties" ADD "isPublished" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_properties" DROP COLUMN "isPublished"`);
    }

}
