import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOrderAndReturnReqeustRelations1693080191636
  implements MigrationInterface
{
  name = 'UpdateOrderAndReturnReqeustRelations1693080191636';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_return_request" DROP CONSTRAINT "FK_dee173281fd1614efacd7617ec2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_2a91cd0eacb4aafc83fac361317"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_return_request" DROP CONSTRAINT "REL_dee173281fd1614efacd7617ec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_return_request" DROP COLUMN "requestId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "UQ_2a91cd0eacb4aafc83fac361317"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP COLUMN "returnRequestId"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "order" ADD "returnRequestId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "UQ_2a91cd0eacb4aafc83fac361317" UNIQUE ("returnRequestId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_return_request" ADD "requestId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_return_request" ADD CONSTRAINT "REL_dee173281fd1614efacd7617ec" UNIQUE ("requestId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_2a91cd0eacb4aafc83fac361317" FOREIGN KEY ("returnRequestId") REFERENCES "order_return_request"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_return_request" ADD CONSTRAINT "FK_dee173281fd1614efacd7617ec2" FOREIGN KEY ("requestId") REFERENCES "request"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
