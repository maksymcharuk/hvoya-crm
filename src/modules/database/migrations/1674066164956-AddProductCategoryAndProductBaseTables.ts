import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProductCategoryAndProductBaseTables1674066164956 implements MigrationInterface {
    name = 'AddProductCategoryAndProductBaseTables1674066164956'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "product_category" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), 
            "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), 
            "name" character varying NOT NULL, CONSTRAINT "UQ_96152d453aaea425b5afde3ae9f" UNIQUE ("name"), CONSTRAINT "PK_0dce9bc93c2d2c399982d04bef1" 
            PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "product_base" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), 
            "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), 
            "name" character varying NOT NULL, 
            "categoryId" integer, CONSTRAINT "UQ_56b87ec6ea1358296853b748f7c" UNIQUE ("name"), CONSTRAINT "PK_13bac3fda6ce20723dd774c39f0" 
            PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `ALTER TABLE "product_base" ADD CONSTRAINT "FK_baa9383d47c877117fd66feea42" 
            FOREIGN KEY ("categoryId") REFERENCES "product_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_base" DROP CONSTRAINT "FK_baa9383d47c877117fd66feea42"`);
        await queryRunner.query(`DROP TABLE "product_base"`);
        await queryRunner.query(`DROP TABLE "product_category"`);
    }

}
