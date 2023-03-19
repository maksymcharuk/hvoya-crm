import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBalanceTableAndUpdatedRelations1679076311466 implements MigrationInterface {
    name = 'AddBalanceTableAndUpdatedRelations1679076311466'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "balance" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "amount" numeric(10,2) NOT NULL DEFAULT '0', "version" integer NOT NULL, CONSTRAINT "PK_079dddd31a81672e8143a649ca0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "payment_transaction" ADD "balanceId" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD "balanceId" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_122eba7abb932493831f1e0f62b" UNIQUE ("balanceId")`);
        await queryRunner.query(`ALTER TABLE "payment_transaction" ADD CONSTRAINT "FK_a383ff3d0c13274d5b731d6e81c" FOREIGN KEY ("balanceId") REFERENCES "balance"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_122eba7abb932493831f1e0f62b" FOREIGN KEY ("balanceId") REFERENCES "balance"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_122eba7abb932493831f1e0f62b"`);
        await queryRunner.query(`ALTER TABLE "payment_transaction" DROP CONSTRAINT "FK_a383ff3d0c13274d5b731d6e81c"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_122eba7abb932493831f1e0f62b"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "balanceId"`);
        await queryRunner.query(`ALTER TABLE "payment_transaction" DROP COLUMN "balanceId"`);
        await queryRunner.query(`DROP TABLE "balance"`);
    }

}
