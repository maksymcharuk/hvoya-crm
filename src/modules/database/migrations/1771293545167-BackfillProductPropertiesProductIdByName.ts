import { MigrationInterface, QueryRunner } from 'typeorm';

export class BackfillProductPropertiesProductIdByName1771293545167
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
                        UPDATE product_properties pp
                        SET "productId" = pv.id
                        FROM product_variant pv
                        INNER JOIN product_properties pv_props
                            ON pv_props.id = pv."propertiesId"
                        WHERE pp."productId" IS NULL
                            AND pp.name = pv_props.name
                `);
  }

  public async down(): Promise<void> {}
}
