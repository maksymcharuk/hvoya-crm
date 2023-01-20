import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProductVauriantAndEditProductBaseWithRelation1674148831221 implements MigrationInterface {
    name = 'AddProductVauriantAndEditProductBaseWithRelation1674148831221'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "product_variant" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), 
            "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), 
            "sku" character varying NOT NULL, 
            "name" character varying NOT NULL, 
            "description" character varying, 
            "size" character varying NOT NULL, 
            "color" character varying NOT NULL, 
            "price" numeric(10,2) NOT NULL, 
            "availableItemCount" integer NOT NULL, 
            "baseProductId" integer, CONSTRAINT "UQ_f4dc2c0888b66d547c175f090e2" UNIQUE ("sku"), CONSTRAINT "UQ_6b011a858bfcd83fde87abf1899" UNIQUE ("name"), CONSTRAINT "PK_1ab69c9935c61f7c70791ae0a9f" 
            PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `ALTER TABLE "product_variant" ADD CONSTRAINT "FK_9f15354d84c90d612ddb36d68a4" 
            FOREIGN KEY ("baseProductId") REFERENCES "product_base"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_variant" DROP CONSTRAINT "FK_9f15354d84c90d612ddb36d68a4"`);
        await queryRunner.query(`DROP TABLE "product_variant"`);
    }

}
