import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserWithMiddleNameFreezeAndConfirmColumns1677265834582 implements MigrationInterface {
    name = 'UpdateUserWithMiddleNameFreezeAndConfirmColumns1677265834582'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "middleName" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "user" ADD "userConfirmed" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "user" ADD "userFreezed" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "userFreezed"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "userConfirmed"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "middleName"`);
    }

}
