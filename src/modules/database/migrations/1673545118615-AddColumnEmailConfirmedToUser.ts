import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnEmailConfirmedToUser1673545118615 implements MigrationInterface {
    name = 'AddColumnEmailConfirmedToUser1673545118615'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "emailConfirmed" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "emailConfirmed"`);
    }

}
