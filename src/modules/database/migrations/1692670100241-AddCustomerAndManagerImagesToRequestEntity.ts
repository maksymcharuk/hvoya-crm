import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCustomerAndManagerImagesToRequestEntity1692670100241 implements MigrationInterface {
    name = 'AddCustomerAndManagerImagesToRequestEntity1692670100241'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "request_customer_images_file" ("requestId" uuid NOT NULL, "fileId" uuid NOT NULL, CONSTRAINT "PK_553752992dc9d27d3789145bab6" PRIMARY KEY ("requestId", "fileId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ee06cd9691c19d8e8b59a676a3" ON "request_customer_images_file" ("requestId") `);
        await queryRunner.query(`CREATE INDEX "IDX_d7bc254bacde7d5f7742e591d1" ON "request_customer_images_file" ("fileId") `);
        await queryRunner.query(`CREATE TABLE "request_manager_images_file" ("requestId" uuid NOT NULL, "fileId" uuid NOT NULL, CONSTRAINT "PK_d3fe53d23e844b3981eb32928ed" PRIMARY KEY ("requestId", "fileId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_34075d4d32dcec3ffe472ace6b" ON "request_manager_images_file" ("requestId") `);
        await queryRunner.query(`CREATE INDEX "IDX_40fad2caeaa3cbc702c26af244" ON "request_manager_images_file" ("fileId") `);
        await queryRunner.query(`ALTER TABLE "request_customer_images_file" ADD CONSTRAINT "FK_ee06cd9691c19d8e8b59a676a3b" FOREIGN KEY ("requestId") REFERENCES "request"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "request_customer_images_file" ADD CONSTRAINT "FK_d7bc254bacde7d5f7742e591d11" FOREIGN KEY ("fileId") REFERENCES "file"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "request_manager_images_file" ADD CONSTRAINT "FK_34075d4d32dcec3ffe472ace6ba" FOREIGN KEY ("requestId") REFERENCES "request"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "request_manager_images_file" ADD CONSTRAINT "FK_40fad2caeaa3cbc702c26af2448" FOREIGN KEY ("fileId") REFERENCES "file"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "request_manager_images_file" DROP CONSTRAINT "FK_40fad2caeaa3cbc702c26af2448"`);
        await queryRunner.query(`ALTER TABLE "request_manager_images_file" DROP CONSTRAINT "FK_34075d4d32dcec3ffe472ace6ba"`);
        await queryRunner.query(`ALTER TABLE "request_customer_images_file" DROP CONSTRAINT "FK_d7bc254bacde7d5f7742e591d11"`);
        await queryRunner.query(`ALTER TABLE "request_customer_images_file" DROP CONSTRAINT "FK_ee06cd9691c19d8e8b59a676a3b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_40fad2caeaa3cbc702c26af244"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_34075d4d32dcec3ffe472ace6b"`);
        await queryRunner.query(`DROP TABLE "request_manager_images_file"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d7bc254bacde7d5f7742e591d1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ee06cd9691c19d8e8b59a676a3"`);
        await queryRunner.query(`DROP TABLE "request_customer_images_file"`);
    }

}
