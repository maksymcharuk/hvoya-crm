import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePackageSizeColumnsToAllowNullableInProductSizeTable1680820401184 implements MigrationInterface {
    name = 'UpdatePackageSizeColumnsToAllowNullableInProductSizeTable1680820401184'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_size" ALTER COLUMN "packageHeight" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_size" ALTER COLUMN "packageWidth" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_size" ALTER COLUMN "packageDepth" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_size" ALTER COLUMN "packageDepth" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_size" ALTER COLUMN "packageWidth" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_size" ALTER COLUMN "packageHeight" SET NOT NULL`);
    }

}
