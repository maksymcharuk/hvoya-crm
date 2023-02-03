import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateProductVariantColumnWithAvaliableItemCountDefault1675359099192 implements MigrationInterface {
    name = 'UpdateProductVariantColumnWithAvaliableItemCountDefault1675359099192'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "phoneNumber" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_variant" ALTER COLUMN "availableItemCount" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_variant" ALTER COLUMN "availableItemCount" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "phoneNumber" SET NOT NULL`);
    }

}
