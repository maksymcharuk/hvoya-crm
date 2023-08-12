import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateOrderReturnRequestItemEntityToHasManyToOneRealtionWithOrderItem1691796766435 implements MigrationInterface {
    name = 'UpdateOrderReturnRequestItemEntityToHasManyToOneRealtionWithOrderItem1691796766435'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_return_request_item" DROP CONSTRAINT "FK_5f2d3c195e47f20f7654066df76"`);
        await queryRunner.query(`ALTER TABLE "order_return_request_item" DROP CONSTRAINT "REL_5f2d3c195e47f20f7654066df7"`);
        await queryRunner.query(`ALTER TABLE "order_return_request_item" ADD CONSTRAINT "FK_5f2d3c195e47f20f7654066df76" FOREIGN KEY ("orderItemId") REFERENCES "order_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_return_request_item" DROP CONSTRAINT "FK_5f2d3c195e47f20f7654066df76"`);
        await queryRunner.query(`ALTER TABLE "order_return_request_item" ADD CONSTRAINT "REL_5f2d3c195e47f20f7654066df7" UNIQUE ("orderItemId")`);
        await queryRunner.query(`ALTER TABLE "order_return_request_item" ADD CONSTRAINT "FK_5f2d3c195e47f20f7654066df76" FOREIGN KEY ("orderItemId") REFERENCES "order_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
