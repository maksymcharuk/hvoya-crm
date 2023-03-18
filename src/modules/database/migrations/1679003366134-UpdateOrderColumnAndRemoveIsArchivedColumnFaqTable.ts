import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateOrderColumnAndRemoveIsArchivedColumnFaqTable1679003366134 implements MigrationInterface {
    name = 'UpdateOrderColumnAndRemoveIsArchivedColumnFaqTable1679003366134'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "faq" DROP COLUMN "isArchived"`);
        await queryRunner.query(`ALTER TABLE "faq" DROP CONSTRAINT "UQ_0096548117fcbfae5846cd89c4d"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "faq" ADD CONSTRAINT "UQ_0096548117fcbfae5846cd89c4d" UNIQUE ("order")`);
        await queryRunner.query(`ALTER TABLE "faq" ADD "isArchived" boolean NOT NULL DEFAULT false`);
    }

}
