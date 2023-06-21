import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNoteColumnToUser1687372824019 implements MigrationInterface {
    name = 'AddNoteColumnToUser1687372824019'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "note" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "note"`);
    }

}
