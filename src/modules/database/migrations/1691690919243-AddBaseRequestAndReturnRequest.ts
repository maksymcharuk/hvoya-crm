import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBaseRequestAndReturnRequest1691690919243 implements MigrationInterface {
    name = 'AddBaseRequestAndReturnRequest1691690919243'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "order_return_request_item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "quantity" integer NOT NULL, "orderItemId" uuid, "orderReturnRequestedId" uuid, "orderReturnApprovedId" uuid, CONSTRAINT "REL_5f2d3c195e47f20f7654066df7" UNIQUE ("orderItemId"), CONSTRAINT "PK_d48c24c652059f4ff24cea178f5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."order_return_delivery_deliveryservice_enum" AS ENUM('NovaPoshta', 'UkrPoshta')`);
        await queryRunner.query(`CREATE TYPE "public"."order_return_delivery_status_enum" AS ENUM('Unspecified', 'Pending', 'Accepted', 'InTransit', 'Arrived', 'Received', 'Returned', 'Declined')`);
        await queryRunner.query(`CREATE TABLE "order_return_delivery" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "trackingId" character varying NOT NULL, "deliveryService" "public"."order_return_delivery_deliveryservice_enum", "status" "public"."order_return_delivery_status_enum" NOT NULL DEFAULT 'Pending', "rawStatus" character varying NOT NULL DEFAULT '', "waybillId" uuid, CONSTRAINT "REL_76ef26ae3345edd87b549ff45c" UNIQUE ("waybillId"), CONSTRAINT "PK_c8265d368a65759c874e7501f1c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."order_return_request_status_enum" AS ENUM('Pending', 'Approved', 'Declined')`);
        await queryRunner.query(`CREATE TABLE "order_return_request" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deduction" numeric(10,2) NOT NULL DEFAULT '0', "total" numeric(10,2) NOT NULL DEFAULT '0', "status" "public"."order_return_request_status_enum" NOT NULL DEFAULT 'Pending', "approved" boolean NOT NULL DEFAULT false, "deliveryId" uuid, "orderId" uuid, CONSTRAINT "REL_7da2ae19465bd98abd46222401" UNIQUE ("deliveryId"), CONSTRAINT "REL_d833ca1da5bf2c48d12e75ba1e" UNIQUE ("orderId"), CONSTRAINT "PK_73fd87212600e343b25ede4136d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."request_requesttype_enum" AS ENUM('Return')`);
        await queryRunner.query(`CREATE TABLE "request" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "number" character varying, "customerComment" character varying, "managerComment" character varying, "requestType" "public"."request_requesttype_enum" NOT NULL, "requestId" uuid NOT NULL, "customerId" uuid, CONSTRAINT "UQ_ff9ae4c48ce4e00f58800a26589" UNIQUE ("number"), CONSTRAINT "REL_89e1288ace643c6bac6ddf46be" UNIQUE ("requestId"), CONSTRAINT "PK_167d324701e6867f189aed52e18" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "order_return_request_item" ADD CONSTRAINT "FK_5f2d3c195e47f20f7654066df76" FOREIGN KEY ("orderItemId") REFERENCES "order_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_return_request_item" ADD CONSTRAINT "FK_c8188f01eede045579c1506ac55" FOREIGN KEY ("orderReturnRequestedId") REFERENCES "order_return_request"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_return_request_item" ADD CONSTRAINT "FK_d2cbeabce0ee8e8a05c31cdbac6" FOREIGN KEY ("orderReturnApprovedId") REFERENCES "order_return_request"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_return_delivery" ADD CONSTRAINT "FK_76ef26ae3345edd87b549ff45cf" FOREIGN KEY ("waybillId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_return_request" ADD CONSTRAINT "FK_7da2ae19465bd98abd462224019" FOREIGN KEY ("deliveryId") REFERENCES "order_return_delivery"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_return_request" ADD CONSTRAINT "FK_d833ca1da5bf2c48d12e75ba1e7" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "request" ADD CONSTRAINT "FK_89e1288ace643c6bac6ddf46bee" FOREIGN KEY ("requestId") REFERENCES "order_return_request"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "request" ADD CONSTRAINT "FK_ea494d8562edd5a4bb96a9092ea" FOREIGN KEY ("customerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "request" DROP CONSTRAINT "FK_ea494d8562edd5a4bb96a9092ea"`);
        await queryRunner.query(`ALTER TABLE "request" DROP CONSTRAINT "FK_89e1288ace643c6bac6ddf46bee"`);
        await queryRunner.query(`ALTER TABLE "order_return_request" DROP CONSTRAINT "FK_d833ca1da5bf2c48d12e75ba1e7"`);
        await queryRunner.query(`ALTER TABLE "order_return_request" DROP CONSTRAINT "FK_7da2ae19465bd98abd462224019"`);
        await queryRunner.query(`ALTER TABLE "order_return_delivery" DROP CONSTRAINT "FK_76ef26ae3345edd87b549ff45cf"`);
        await queryRunner.query(`ALTER TABLE "order_return_request_item" DROP CONSTRAINT "FK_d2cbeabce0ee8e8a05c31cdbac6"`);
        await queryRunner.query(`ALTER TABLE "order_return_request_item" DROP CONSTRAINT "FK_c8188f01eede045579c1506ac55"`);
        await queryRunner.query(`ALTER TABLE "order_return_request_item" DROP CONSTRAINT "FK_5f2d3c195e47f20f7654066df76"`);
        await queryRunner.query(`DROP TABLE "request"`);
        await queryRunner.query(`DROP TYPE "public"."request_requesttype_enum"`);
        await queryRunner.query(`DROP TABLE "order_return_request"`);
        await queryRunner.query(`DROP TYPE "public"."order_return_request_status_enum"`);
        await queryRunner.query(`DROP TABLE "order_return_delivery"`);
        await queryRunner.query(`DROP TYPE "public"."order_return_delivery_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."order_return_delivery_deliveryservice_enum"`);
        await queryRunner.query(`DROP TABLE "order_return_request_item"`);
    }

}
