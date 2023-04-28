import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTypeColumnForNotifications1682699777186 implements MigrationInterface {
    name = 'AddTypeColumnForNotifications1682699777186'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" ADD "type" character varying NOT NULL DEFAULT 'info'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "type"`);
    }

}
