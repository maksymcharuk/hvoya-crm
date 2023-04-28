import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveUrlFromNotificationAddDataColumn1682711725292 implements MigrationInterface {
    name = 'RemoveUrlFromNotificationAddDataColumn1682711725292'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" RENAME COLUMN "url" TO "data"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "data"`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "data" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "data"`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "data" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "notification" RENAME COLUMN "data" TO "url"`);
    }

}
