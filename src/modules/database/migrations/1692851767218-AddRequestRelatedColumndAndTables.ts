import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRequestRelatedColumndAndTables1692851767218
  implements MigrationInterface
{
  name = 'AddRequestRelatedColumndAndTables1692851767218';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."order_return_delivery_deliveryservice_enum" AS ENUM('NovaPoshta', 'UkrPoshta')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."order_return_delivery_status_enum" AS ENUM('Unspecified', 'Pending', 'Accepted', 'InTransit', 'Arrived', 'Received', 'Returned', 'Declined')`,
    );
    await queryRunner.query(
      `CREATE TABLE "order_return_delivery" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "trackingId" character varying NOT NULL, "deliveryService" "public"."order_return_delivery_deliveryservice_enum", "status" "public"."order_return_delivery_status_enum" NOT NULL DEFAULT 'Pending', "rawStatus" character varying NOT NULL DEFAULT '', "waybillId" uuid, CONSTRAINT "REL_76ef26ae3345edd87b549ff45c" UNIQUE ("waybillId"), CONSTRAINT "PK_c8265d368a65759c874e7501f1c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "order_return_request_item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "quantity" integer NOT NULL, "orderItemId" uuid, "orderReturnRequestedId" uuid, "orderReturnApprovedId" uuid, CONSTRAINT "PK_d48c24c652059f4ff24cea178f5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."request_requesttype_enum" AS ENUM('Return')`,
    );
    await queryRunner.query(
      `CREATE TABLE "request" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "number" character varying, "customerComment" character varying, "managerComment" character varying, "requestType" "public"."request_requesttype_enum" NOT NULL, "requestId" uuid NOT NULL, "customerId" uuid, CONSTRAINT "UQ_ff9ae4c48ce4e00f58800a26589" UNIQUE ("number"), CONSTRAINT "REL_89e1288ace643c6bac6ddf46be" UNIQUE ("requestId"), CONSTRAINT "PK_167d324701e6867f189aed52e18" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."order_return_request_status_enum" AS ENUM('Pending', 'Approved', 'Declined')`,
    );
    await queryRunner.query(
      `CREATE TABLE "order_return_request" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deduction" numeric(10,2) NOT NULL DEFAULT '0', "total" numeric(10,2) NOT NULL DEFAULT '0', "status" "public"."order_return_request_status_enum" NOT NULL DEFAULT 'Pending', "deliveryId" uuid, "orderId" uuid, "requestId" uuid, CONSTRAINT "REL_7da2ae19465bd98abd46222401" UNIQUE ("deliveryId"), CONSTRAINT "REL_d833ca1da5bf2c48d12e75ba1e" UNIQUE ("orderId"), CONSTRAINT "REL_dee173281fd1614efacd7617ec" UNIQUE ("requestId"), CONSTRAINT "PK_73fd87212600e343b25ede4136d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "request_customer_images_file" ("requestId" uuid NOT NULL, "fileId" uuid NOT NULL, CONSTRAINT "PK_553752992dc9d27d3789145bab6" PRIMARY KEY ("requestId", "fileId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ee06cd9691c19d8e8b59a676a3" ON "request_customer_images_file" ("requestId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d7bc254bacde7d5f7742e591d1" ON "request_customer_images_file" ("fileId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "request_manager_images_file" ("requestId" uuid NOT NULL, "fileId" uuid NOT NULL, CONSTRAINT "PK_d3fe53d23e844b3981eb32928ed" PRIMARY KEY ("requestId", "fileId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_34075d4d32dcec3ffe472ace6b" ON "request_manager_images_file" ("requestId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_40fad2caeaa3cbc702c26af244" ON "request_manager_images_file" ("fileId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" ADD "orderReturnRequestId" uuid`,
    );
    await queryRunner.query(`ALTER TABLE "order" ADD "returnRequestId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "UQ_2a91cd0eacb4aafc83fac361317" UNIQUE ("returnRequestId")`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."notification_type_enum" RENAME TO "notification_type_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."notification_type_enum" AS ENUM('info', 'user.created', 'user.confirmed', 'admin.created', 'order.created', 'order.cancelled', 'order.status.updated', 'request.created', 'request.rejected', 'request.approved')`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ALTER COLUMN "type" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ALTER COLUMN "type" TYPE "public"."notification_type_enum" USING "type"::"text"::"public"."notification_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ALTER COLUMN "type" SET DEFAULT 'info'`,
    );
    await queryRunner.query(`DROP TYPE "public"."notification_type_enum_old"`);
    await queryRunner.query(
      `ALTER TYPE "public"."order_status_status_enum" RENAME TO "order_status_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."order_status_status_enum" AS ENUM('Pending', 'Processing', 'TransferedToDelivery', 'Fulfilled', 'Cancelled', 'Refunded', 'Refused')`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_status" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_status" ALTER COLUMN "status" TYPE "public"."order_status_status_enum" USING "status"::"text"::"public"."order_status_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_status" ALTER COLUMN "status" SET DEFAULT 'Pending'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."order_status_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_return_delivery" ADD CONSTRAINT "FK_76ef26ae3345edd87b549ff45cf" FOREIGN KEY ("waybillId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_return_request_item" ADD CONSTRAINT "FK_5f2d3c195e47f20f7654066df76" FOREIGN KEY ("orderItemId") REFERENCES "order_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_return_request_item" ADD CONSTRAINT "FK_c8188f01eede045579c1506ac55" FOREIGN KEY ("orderReturnRequestedId") REFERENCES "order_return_request"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_return_request_item" ADD CONSTRAINT "FK_d2cbeabce0ee8e8a05c31cdbac6" FOREIGN KEY ("orderReturnApprovedId") REFERENCES "order_return_request"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "request" ADD CONSTRAINT "FK_89e1288ace643c6bac6ddf46bee" FOREIGN KEY ("requestId") REFERENCES "order_return_request"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "request" ADD CONSTRAINT "FK_ea494d8562edd5a4bb96a9092ea" FOREIGN KEY ("customerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" ADD CONSTRAINT "FK_61c87e1fd3fb8397ee38715509f" FOREIGN KEY ("orderReturnRequestId") REFERENCES "order_return_request"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_return_request" ADD CONSTRAINT "FK_7da2ae19465bd98abd462224019" FOREIGN KEY ("deliveryId") REFERENCES "order_return_delivery"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_return_request" ADD CONSTRAINT "FK_d833ca1da5bf2c48d12e75ba1e7" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_return_request" ADD CONSTRAINT "FK_dee173281fd1614efacd7617ec2" FOREIGN KEY ("requestId") REFERENCES "request"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_2a91cd0eacb4aafc83fac361317" FOREIGN KEY ("returnRequestId") REFERENCES "order_return_request"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "request_customer_images_file" ADD CONSTRAINT "FK_ee06cd9691c19d8e8b59a676a3b" FOREIGN KEY ("requestId") REFERENCES "request"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "request_customer_images_file" ADD CONSTRAINT "FK_d7bc254bacde7d5f7742e591d11" FOREIGN KEY ("fileId") REFERENCES "file"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "request_manager_images_file" ADD CONSTRAINT "FK_34075d4d32dcec3ffe472ace6ba" FOREIGN KEY ("requestId") REFERENCES "request"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "request_manager_images_file" ADD CONSTRAINT "FK_40fad2caeaa3cbc702c26af2448" FOREIGN KEY ("fileId") REFERENCES "file"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "request_manager_images_file" DROP CONSTRAINT "FK_40fad2caeaa3cbc702c26af2448"`,
    );
    await queryRunner.query(
      `ALTER TABLE "request_manager_images_file" DROP CONSTRAINT "FK_34075d4d32dcec3ffe472ace6ba"`,
    );
    await queryRunner.query(
      `ALTER TABLE "request_customer_images_file" DROP CONSTRAINT "FK_d7bc254bacde7d5f7742e591d11"`,
    );
    await queryRunner.query(
      `ALTER TABLE "request_customer_images_file" DROP CONSTRAINT "FK_ee06cd9691c19d8e8b59a676a3b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_2a91cd0eacb4aafc83fac361317"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_return_request" DROP CONSTRAINT "FK_dee173281fd1614efacd7617ec2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_return_request" DROP CONSTRAINT "FK_d833ca1da5bf2c48d12e75ba1e7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_return_request" DROP CONSTRAINT "FK_7da2ae19465bd98abd462224019"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" DROP CONSTRAINT "FK_61c87e1fd3fb8397ee38715509f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "request" DROP CONSTRAINT "FK_ea494d8562edd5a4bb96a9092ea"`,
    );
    await queryRunner.query(
      `ALTER TABLE "request" DROP CONSTRAINT "FK_89e1288ace643c6bac6ddf46bee"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_return_request_item" DROP CONSTRAINT "FK_d2cbeabce0ee8e8a05c31cdbac6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_return_request_item" DROP CONSTRAINT "FK_c8188f01eede045579c1506ac55"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_return_request_item" DROP CONSTRAINT "FK_5f2d3c195e47f20f7654066df76"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_return_delivery" DROP CONSTRAINT "FK_76ef26ae3345edd87b549ff45cf"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."order_status_status_enum_old" AS ENUM('Pending', 'Processing', 'Packaging', 'TransferedToDelivery', 'Fulfilled', 'Cancelled', 'Refunded')`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_status" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_status" ALTER COLUMN "status" TYPE "public"."order_status_status_enum_old" USING "status"::"text"::"public"."order_status_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_status" ALTER COLUMN "status" SET DEFAULT 'Pending'`,
    );
    await queryRunner.query(`DROP TYPE "public"."order_status_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."order_status_status_enum_old" RENAME TO "order_status_status_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."notification_type_enum_old" AS ENUM('info', 'user.created', 'user.confirmed', 'admin.created', 'order.created', 'order.cancelled', 'order.status.updated')`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ALTER COLUMN "type" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ALTER COLUMN "type" TYPE "public"."notification_type_enum_old" USING "type"::"text"::"public"."notification_type_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ALTER COLUMN "type" SET DEFAULT 'info'`,
    );
    await queryRunner.query(`DROP TYPE "public"."notification_type_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."notification_type_enum_old" RENAME TO "notification_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "UQ_2a91cd0eacb4aafc83fac361317"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP COLUMN "returnRequestId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" DROP COLUMN "orderReturnRequestId"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_40fad2caeaa3cbc702c26af244"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_34075d4d32dcec3ffe472ace6b"`,
    );
    await queryRunner.query(`DROP TABLE "request_manager_images_file"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d7bc254bacde7d5f7742e591d1"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ee06cd9691c19d8e8b59a676a3"`,
    );
    await queryRunner.query(`DROP TABLE "request_customer_images_file"`);
    await queryRunner.query(`DROP TABLE "order_return_request"`);
    await queryRunner.query(
      `DROP TYPE "public"."order_return_request_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "request"`);
    await queryRunner.query(`DROP TYPE "public"."request_requesttype_enum"`);
    await queryRunner.query(`DROP TABLE "order_return_request_item"`);
    await queryRunner.query(`DROP TABLE "order_return_delivery"`);
    await queryRunner.query(
      `DROP TYPE "public"."order_return_delivery_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."order_return_delivery_deliveryservice_enum"`,
    );
  }
}
