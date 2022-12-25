import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserTable1671938264353 implements MigrationInterface {
  name = 'AddUserTable1671938264353';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" (
        "id" integer NOT NULL, 
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(), 
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), 
        "email" character varying NOT NULL, 
        "firstName" character varying NOT NULL, 
        "lastName" character varying NOT NULL, 
        "password" character varying NOT NULL, 
        CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), 
        CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
