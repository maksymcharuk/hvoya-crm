import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOrderReturnEntities1688819634885 implements MigrationInterface {
    name = 'AddOrderReturnEntities1688819634885'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "order_return_request_item" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
            "createdAt" TIMESTAMP NOT NULL DEFAULT now(), 
            "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), 
            "quantity" integer NOT NULL, 
            "approved" boolean NOT NULL DEFAULT false, 
            "orderItemId" uuid, 
            "orderReturnRequestedId" uuid, 
            "orderReturnApprovedId" uuid, 
            CONSTRAINT "REL_5f2d3c195e47f20f7654066df7" UNIQUE ("orderItemId"), 
            CONSTRAINT "PK_d48c24c652059f4ff24cea178f5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."order_return_delivery_deliveryservice_enum" AS ENUM('NovaPoshta', 'UkrPoshta')`);
        await queryRunner.query(`CREATE TABLE "order_return_delivery" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
            "createdAt" TIMESTAMP NOT NULL DEFAULT now(), 
            "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), 
            "trackingId" character varying NOT NULL, 
            "deliveryService" "public"."order_return_delivery_deliveryservice_enum", 
            "rawStatus" character varying NOT NULL, 
            "waybillId" uuid, 
            CONSTRAINT "REL_76ef26ae3345edd87b549ff45c" UNIQUE ("waybillId"), 
            CONSTRAINT "PK_c8265d368a65759c874e7501f1c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."order_return_request_status_enum" AS ENUM('Pending', 'Approved', 'Declined')`);
        await queryRunner.query(`CREATE TABLE "order_return_request" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "createdAt" TIMESTAMP NOT NULL DEFAULT now(), 
            "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), 
            "customerComment" character varying NOT NULL, 
            "managerComment" character varying NOT NULL, 
            "deduction" numeric(10,2) NOT NULL DEFAULT '0', 
            "total" numeric(10,2) NOT NULL DEFAULT '0', 
            "status" "public"."order_return_request_status_enum" NOT NULL DEFAULT 'Pending', 
            "orderId" uuid, 
            "customerId" uuid, 
            CONSTRAINT "REL_d833ca1da5bf2c48d12e75ba1e" UNIQUE ("orderId"), 
            CONSTRAINT "PK_73fd87212600e343b25ede4136d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "order_return_request_item" ADD 
            CONSTRAINT "FK_5f2d3c195e47f20f7654066df76" 
            FOREIGN KEY ("orderItemId") 
            REFERENCES "order_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_return_request_item" ADD 
            CONSTRAINT "FK_c8188f01eede045579c1506ac55" 
            FOREIGN KEY ("orderReturnRequestedId") 
            REFERENCES "order_return_request"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_return_request_item" ADD 
            CONSTRAINT "FK_d2cbeabce0ee8e8a05c31cdbac6" 
            FOREIGN KEY ("orderReturnApprovedId") 
            REFERENCES "order_return_request"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_return_delivery" ADD 
            CONSTRAINT "FK_76ef26ae3345edd87b549ff45cf" 
            FOREIGN KEY ("waybillId") 
            REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_return_request" ADD 
            CONSTRAINT "FK_d833ca1da5bf2c48d12e75ba1e7" 
            FOREIGN KEY ("orderId") 
            REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_return_request" ADD 
            CONSTRAINT "FK_c2712a5df9b2dc7004c86da31df" 
            FOREIGN KEY ("customerId") 
            REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_return_request" DROP CONSTRAINT "FK_c2712a5df9b2dc7004c86da31df"`);
        await queryRunner.query(`ALTER TABLE "order_return_request" DROP CONSTRAINT "FK_d833ca1da5bf2c48d12e75ba1e7"`);
        await queryRunner.query(`ALTER TABLE "order_return_delivery" DROP CONSTRAINT "FK_76ef26ae3345edd87b549ff45cf"`);
        await queryRunner.query(`ALTER TABLE "order_return_request_item" DROP CONSTRAINT "FK_d2cbeabce0ee8e8a05c31cdbac6"`);
        await queryRunner.query(`ALTER TABLE "order_return_request_item" DROP CONSTRAINT "FK_c8188f01eede045579c1506ac55"`);
        await queryRunner.query(`ALTER TABLE "order_return_request_item" DROP CONSTRAINT "FK_5f2d3c195e47f20f7654066df76"`);
        await queryRunner.query(`DROP TABLE "order_return_request"`);
        await queryRunner.query(`DROP TYPE "public"."order_return_request_status_enum"`);
        await queryRunner.query(`DROP TABLE "order_return_delivery"`);
        await queryRunner.query(`DROP TYPE "public"."order_return_delivery_deliveryservice_enum"`);
        await queryRunner.query(`DROP TABLE "order_return_request_item"`);
    }

}
