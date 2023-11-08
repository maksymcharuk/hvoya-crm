import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNetBalanceColumnToPaymenTransactionTable1699479911250
  implements MigrationInterface
{
  name = 'AddNetBalanceColumnToPaymenTransactionTable1699479911250';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" ADD "netBalance" numeric(10,2) NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" DROP COLUMN "netBalance"`,
    );
  }
}
