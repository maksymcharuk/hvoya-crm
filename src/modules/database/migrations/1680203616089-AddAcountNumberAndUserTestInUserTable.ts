import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAcountNumberAndUserTestInUserTable1680203616089 implements MigrationInterface {
    name = 'AddAcountNumberAndUserTestInUserTable1680203616089'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "accountNumber" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_cc09a77e7c732ac84c7d4c1c82e" UNIQUE ("accountNumber")`);
        await queryRunner.query(`ALTER TABLE "user" ADD "userTest" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "userTest"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_cc09a77e7c732ac84c7d4c1c82e"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "accountNumber"`);
    }

}
