import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFaqTable1678846025187 implements MigrationInterface {
  name = 'AddFaqTable1678846025187';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "faq" (
        "id" SERIAL NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "question" character varying NOT NULL,
        "answer" character varying NOT NULL,
        "order" integer NOT NULL,
        "isPublished" boolean NOT NULL DEFAULT false,
        "isArchived" boolean NOT NULL DEFAULT false,
        CONSTRAINT "UQ_0096548117fcbfae5846cd89c4d" UNIQUE ("order"),
        CONSTRAINT "PK_d6f5a52b1a96dd8d0591f9fbc47" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "faq"`);
  }
}
