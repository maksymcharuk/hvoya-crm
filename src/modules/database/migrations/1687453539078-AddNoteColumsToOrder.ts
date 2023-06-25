import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNoteColumsToOrder1687453539078 implements MigrationInterface {
    name = 'AddNoteColumsToOrder1687453539078'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" ADD "customerNote" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "order" ADD "managerNote" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "managerNote"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "customerNote"`);
    }

}
