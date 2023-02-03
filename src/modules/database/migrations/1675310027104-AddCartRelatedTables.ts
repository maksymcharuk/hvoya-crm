import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCartRelatedTables1675310027104 implements MigrationInterface {
  name = 'AddCartRelatedTables1675310027104';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "cart_item" (
        "id" SERIAL NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "quantity" integer NOT NULL,
        "productId" integer,
        "cartId" integer,
        CONSTRAINT "PK_bd94725aa84f8cf37632bcde997" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cart" (
        "id" SERIAL NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "total" numeric(10,2) NOT NULL DEFAULT '0',
        CONSTRAINT "PK_c524ec48751b9b5bcfbf6e59be7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`
      ALTER TABLE "user"
        ADD "cartId" integer,
        ADD CONSTRAINT "UQ_342497b574edb2309ec8c6b62aa" UNIQUE ("cartId"),
        ALTER COLUMN "phoneNumber" DROP NOT NULL`);

    await queryRunner.query(
      `ALTER TABLE "cart_item"
        ADD CONSTRAINT "FK_75db0de134fe0f9fe9e4591b7bf"
        FOREIGN KEY ("productId")
        REFERENCES "product_variant"("id")
        ON DELETE NO ACTION
        ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_item"
        ADD CONSTRAINT "FK_29e590514f9941296f3a2440d39"
        FOREIGN KEY ("cartId")
        REFERENCES "cart"("id")
        ON DELETE NO ACTION
        ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user"
        ADD CONSTRAINT "FK_342497b574edb2309ec8c6b62aa"
        FOREIGN KEY ("cartId")
        REFERENCES "cart"("id")
        ON DELETE NO ACTION
        ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cart_item"
        DROP CONSTRAINT "FK_29e590514f9941296f3a2440d39",
        DROP CONSTRAINT "FK_75db0de134fe0f9fe9e4591b7bf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user"
        ALTER COLUMN "phoneNumber" SET NOT NULL,
        DROP CONSTRAINT "FK_342497b574edb2309ec8c6b62aa",
        DROP CONSTRAINT "UQ_342497b574edb2309ec8c6b62aa",
        DROP COLUMN "cartId"`,
    );
    await queryRunner.query(`DROP TABLE "cart"`);
    await queryRunner.query(`DROP TABLE "cart_item"`);
  }
}
