import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateProductPropertiesNameColumn1676757459611 implements MigrationInterface {
    name = 'UpdateProductPropertiesNameColumn1676757459611'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_properties" DROP CONSTRAINT "UQ_e7e877ad5e4dda89a4e35699821"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_properties" ADD CONSTRAINT "UQ_e7e877ad5e4dda89a4e35699821" UNIQUE ("name")`);
    }

}
