import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCustomerAndManagerImagesToRequestEntity1692652686430 implements MigrationInterface {
    name = 'AddCustomerAndManagerImagesToRequestEntity1692652686430'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "request" ADD "customerImagesId" uuid`);
        await queryRunner.query(`ALTER TABLE "request" ADD "managerImagesId" uuid`);
        await queryRunner.query(`ALTER TABLE "request" ADD CONSTRAINT "FK_88bdaa1d4ce611711a1841165a1" FOREIGN KEY ("customerImagesId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "request" ADD CONSTRAINT "FK_e722ce68f8b6e1d5f3fc8bf2a81" FOREIGN KEY ("managerImagesId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "request" DROP CONSTRAINT "FK_e722ce68f8b6e1d5f3fc8bf2a81"`);
        await queryRunner.query(`ALTER TABLE "request" DROP CONSTRAINT "FK_88bdaa1d4ce611711a1841165a1"`);
        await queryRunner.query(`ALTER TABLE "request" DROP COLUMN "managerImagesId"`);
        await queryRunner.query(`ALTER TABLE "request" DROP COLUMN "customerImagesId"`);
    }

}
