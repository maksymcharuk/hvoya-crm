import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrderRelatedTables1676497220978 implements MigrationInterface {
  name = 'AddOrderRelatedTables1676497220978';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."order_delivery_status_enum" 
        AS ENUM('Pending', 'Processing', 'OutForDelivery', 'Delivered', 'Cancelled')`,
    );
    await queryRunner.query(
      `CREATE TABLE "order_delivery" (
        "id" SERIAL NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "trackingId" character varying NOT NULL,
        "status" "public"."order_delivery_status_enum" NOT NULL DEFAULT 'Pending',
        CONSTRAINT "PK_962eec87d3d029c51525f259fba" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "order_item" (
        "id" SERIAL NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "quantity" integer NOT NULL,
        "productId" integer,
        "productPropertiesId" integer,
        "orderId" integer,
        CONSTRAINT "PK_d01158fe15b1ead5c26fd7f4e90" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."payment_transaction_status_enum" 
        AS ENUM('Pending', 'Processing', 'Completed', 'Failed')`,
    );
    await queryRunner.query(
      `CREATE TABLE "payment_transaction" (
        "id" SERIAL NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "amount" numeric(10,2) NOT NULL DEFAULT '0',
        "status" "public"."payment_transaction_status_enum" NOT NULL DEFAULT 'Pending',
        "orderId" integer,
        CONSTRAINT "PK_82c3470854cf4642dfb0d7150cd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."order_status_enum"
        AS ENUM('Pending', 'Processing', 'Fulfilled', 'Cancelled', 'Refunded')`,
    );
    await queryRunner.query(
      `CREATE TABLE "order" (
        "id" SERIAL NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "total" numeric(10,2) NOT NULL DEFAULT '0',
        "status" "public"."order_status_enum" NOT NULL DEFAULT 'Pending',
        "deliveryId" integer,
        "customerId" integer,
        CONSTRAINT "REL_ec67a0143b254c3577087b20d3" UNIQUE ("deliveryId"),
        CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item"
        ADD CONSTRAINT "FK_904370c093ceea4369659a3c810"
        FOREIGN KEY ("productId")
        REFERENCES "product_variant"("id")
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
        ADD CONSTRAINT "FK_80a1b7abed72e271c31fc4cc75a"
        FOREIGN KEY ("productPropertiesId")
        REFERENCES "product_properties"("id")
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
        ADD CONSTRAINT "FK_646bf9ece6f45dbe41c203e06e0"
        FOREIGN KEY ("orderId")
        REFERENCES "order"("id")
        ON DELETE NO ACTION
        ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction"
        ADD CONSTRAINT "FK_eec1bdc9c06ce2fcd67cd79082b"
        FOREIGN KEY ("orderId")
        REFERENCES "order"("id")
        ON DELETE NO ACTION
        ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order"
        ADD CONSTRAINT "FK_ec67a0143b254c3577087b20d3a"
        FOREIGN KEY ("deliveryId")
        REFERENCES "order_delivery"("id")
        ON DELETE NO ACTION
        ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" 
        ADD CONSTRAINT "FK_124456e637cca7a415897dce659" 
        FOREIGN KEY ("customerId")
        REFERENCES "user"("id")
        ON DELETE NO ACTION
        ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order"
        DROP CONSTRAINT "FK_124456e637cca7a415897dce659",
        DROP CONSTRAINT "FK_ec67a0143b254c3577087b20d3a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction"
        DROP CONSTRAINT "FK_eec1bdc9c06ce2fcd67cd79082b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item"
        DROP CONSTRAINT "FK_646bf9ece6f45dbe41c203e06e0",
        DROP CONSTRAINT "FK_80a1b7abed72e271c31fc4cc75a",
        DROP CONSTRAINT "FK_904370c093ceea4369659a3c810"`,
    );
    await queryRunner.query(`DROP TABLE "order"`);
    await queryRunner.query(`DROP TYPE "public"."order_status_enum"`);
    await queryRunner.query(`DROP TABLE "payment_transaction"`);
    await queryRunner.query(
      `DROP TYPE "public"."payment_transaction_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "order_item"`);
    await queryRunner.query(`DROP TABLE "order_delivery"`);
    await queryRunner.query(`DROP TYPE "public"."order_delivery_status_enum"`);
  }
}
