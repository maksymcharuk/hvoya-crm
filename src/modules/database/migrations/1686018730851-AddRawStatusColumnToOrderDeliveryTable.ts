import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRawStatusColumnToOrderDeliveryTable1686018730851
  implements MigrationInterface
{
  name = 'AddRawStatusColumnToOrderDeliveryTable1686018730851';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_delivery" ADD "rawStatus" character varying NOT NULL DEFAULT ''`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_delivery" DROP COLUMN "rawStatus"`,
    );
  }
}
