import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrderStatusTableAndRelationToOrderTable1685583627400
  implements MigrationInterface
{
  name = 'AddOrderStatusTableAndRelationToOrderTable1685583627400';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."order_status_status_enum" AS ENUM('Pending', 'Processing', 'Packaging', 'TransferedToDelivery', 'Fulfilled', 'Cancelled', 'Refunded')`,
    );
    await queryRunner.query(
      `CREATE TABLE "order_status" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "status" "public"."order_status_status_enum" NOT NULL DEFAULT 'Pending', "comment" character varying NOT NULL DEFAULT '', "orderId" uuid, "createdById" uuid, CONSTRAINT "PK_8ea75b2a26f83f3bc98b9c6aaf6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."order_status_enum"`);
    await queryRunner.query(
      `ALTER TABLE "order_status" ADD CONSTRAINT "FK_014fe4a8ab95c64fdb7b8beb253" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_status" ADD CONSTRAINT "FK_b58c6943057c7e4ccc0d3b4c2c3" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_status" DROP CONSTRAINT "FK_b58c6943057c7e4ccc0d3b4c2c3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_status" DROP CONSTRAINT "FK_014fe4a8ab95c64fdb7b8beb253"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."order_status_enum" AS ENUM('Pending', 'Processing', 'Packaging', 'TransferedToDelivery', 'Fulfilled', 'Cancelled', 'Refunded')`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD "status" "public"."order_status_enum" NOT NULL DEFAULT 'Pending'`,
    );
    await queryRunner.query(`DROP TABLE "order_status"`);
    await queryRunner.query(`DROP TYPE "public"."order_status_status_enum"`);
  }
}
