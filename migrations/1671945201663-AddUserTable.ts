import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserTable1671945201663 implements MigrationInterface {
  name = 'AddUserTable1671945201663';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" (
        "id" SERIAL NOT NULL, 
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(), 
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), 
        "email" character varying NOT NULL, 
        "firstName" character varying DEFAULT '', 
        "lastName" character varying DEFAULT '', 
        "password" character varying NOT NULL, 
        CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), 
        CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "firstName" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "lastName" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "lastName" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "firstName" DROP NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
