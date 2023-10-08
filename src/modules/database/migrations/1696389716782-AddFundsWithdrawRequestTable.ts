import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFundsWithdrawRequestTable1696389716782
  implements MigrationInterface
{
  name = 'AddFundsWithdrawRequestTable1696389716782';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // store id and requestId from Request table in a temporary table
    await queryRunner.query(
      `CREATE TABLE "request_temp" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "requestId" uuid, CONSTRAINT "PK_2d9d1a4f7b1c3e8b7b1e9f4b1e0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `INSERT INTO "request_temp" ("id", "requestId") SELECT "id", "requestId" FROM "request"`,
    );

    await queryRunner.query(
      `ALTER TABLE "request" DROP CONSTRAINT "FK_89e1288ace643c6bac6ddf46bee"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."funds_withdrawal_request_status_enum" AS ENUM('Pending', 'Approved', 'Declined')`,
    );
    await queryRunner.query(
      `CREATE TABLE "funds_withdrawal_request" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "amount" numeric(10,2) NOT NULL DEFAULT '0', "status" "public"."funds_withdrawal_request_status_enum" NOT NULL DEFAULT 'Pending', "fundsWithdrawalReceiptId" uuid, CONSTRAINT "REL_a39f9b1a6c7448749ad4f50a12" UNIQUE ("fundsWithdrawalReceiptId"), CONSTRAINT "PK_d8c372789e8f73c9f466f5abd4f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "request" DROP CONSTRAINT "REL_89e1288ace643c6bac6ddf46be"`,
    );
    await queryRunner.query(`ALTER TABLE "request" DROP COLUMN "requestId"`);
    await queryRunner.query(`ALTER TABLE "request" ADD "returnRequestId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "request" ADD CONSTRAINT "UQ_717d44c9b92e5149742eb7b7b52" UNIQUE ("returnRequestId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "request" ADD "fundsWithdrawalRequestId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "request" ADD CONSTRAINT "UQ_36dc6fd17951aa9df3b05cdf7ff" UNIQUE ("fundsWithdrawalRequestId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" ADD "fundsWithdrawalRequestId" uuid`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."request_requesttype_enum" RENAME TO "request_requesttype_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."request_requesttype_enum" AS ENUM('Return', 'FundsWithdrawal')`,
    );
    await queryRunner.query(
      `ALTER TABLE "request" ALTER COLUMN "requestType" TYPE "public"."request_requesttype_enum" USING "requestType"::"text"::"public"."request_requesttype_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."request_requesttype_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "funds_withdrawal_request" ADD CONSTRAINT "FK_a39f9b1a6c7448749ad4f50a12f" FOREIGN KEY ("fundsWithdrawalReceiptId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "request" ADD CONSTRAINT "FK_717d44c9b92e5149742eb7b7b52" FOREIGN KEY ("returnRequestId") REFERENCES "order_return_request"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "request" ADD CONSTRAINT "FK_36dc6fd17951aa9df3b05cdf7ff" FOREIGN KEY ("fundsWithdrawalRequestId") REFERENCES "funds_withdrawal_request"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" ADD CONSTRAINT "FK_a03070ff0de654f53c66be40fae" FOREIGN KEY ("fundsWithdrawalRequestId") REFERENCES "funds_withdrawal_request"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    // restore id and requestId from Request table, write requestId to returnRequestId column and drop temporary table
    await queryRunner.query(
      `UPDATE "request" SET "returnRequestId" = "request_temp"."requestId" FROM "request_temp" WHERE "request_temp"."id" = "request"."id"`,
    );
    await queryRunner.query(`DROP TABLE "request_temp"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // store id and returnRequestId from Request table in a temporary table
    await queryRunner.query(
      `CREATE TABLE "request_temp" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "returnRequestId" uuid, CONSTRAINT "PK_2d9d1a4f7b1c3e8b7b1e9f4b1e0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `INSERT INTO "request_temp" ("id", "returnRequestId") SELECT "id", "returnRequestId" FROM "request"`,
    );

    await queryRunner.query(
      `ALTER TABLE "payment_transaction" DROP CONSTRAINT "FK_a03070ff0de654f53c66be40fae"`,
    );
    await queryRunner.query(
      `ALTER TABLE "request" DROP CONSTRAINT "FK_36dc6fd17951aa9df3b05cdf7ff"`,
    );
    await queryRunner.query(
      `ALTER TABLE "request" DROP CONSTRAINT "FK_717d44c9b92e5149742eb7b7b52"`,
    );
    await queryRunner.query(
      `ALTER TABLE "funds_withdrawal_request" DROP CONSTRAINT "FK_a39f9b1a6c7448749ad4f50a12f"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."request_requesttype_enum_old" AS ENUM('Return')`,
    );
    await queryRunner.query(
      `ALTER TABLE "request" ALTER COLUMN "requestType" TYPE "public"."request_requesttype_enum_old" USING "requestType"::"text"::"public"."request_requesttype_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."request_requesttype_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."request_requesttype_enum_old" RENAME TO "request_requesttype_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" DROP COLUMN "fundsWithdrawalRequestId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "request" DROP CONSTRAINT "UQ_36dc6fd17951aa9df3b05cdf7ff"`,
    );
    await queryRunner.query(
      `ALTER TABLE "request" DROP COLUMN "fundsWithdrawalRequestId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "request" DROP CONSTRAINT "UQ_717d44c9b92e5149742eb7b7b52"`,
    );
    await queryRunner.query(
      `ALTER TABLE "request" DROP COLUMN "returnRequestId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "request" ADD "requestId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "request" ADD CONSTRAINT "REL_89e1288ace643c6bac6ddf46be" UNIQUE ("requestId")`,
    );
    await queryRunner.query(`DROP TABLE "funds_withdrawal_request"`);
    await queryRunner.query(
      `DROP TYPE "public"."funds_withdrawal_request_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "request" ADD CONSTRAINT "FK_89e1288ace643c6bac6ddf46bee" FOREIGN KEY ("requestId") REFERENCES "order_return_request"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    // restore id and returnRequestId from Request table, write returnRequestId to requestId column and drop temporary table
    await queryRunner.query(
      `UPDATE "request" SET "requestId" = "request_temp"."returnRequestId" FROM "request_temp" WHERE "request_temp"."id" = "request"."id"`,
    );
    await queryRunner.query(`DROP TABLE "request_temp"`);
  }
}
