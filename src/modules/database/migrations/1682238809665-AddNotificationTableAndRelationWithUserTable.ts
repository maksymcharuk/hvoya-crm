import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNotificationTableAndRelationWithUserTable1682238809665 implements MigrationInterface {
    name = 'AddNotificationTableAndRelationWithUserTable1682238809665'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "notification" 
            ("id" SERIAL NOT NULL, 
            "createdAt" TIMESTAMP NOT NULL DEFAULT now(), 
            "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), 
            "message" character varying NOT NULL, 
            "url" character varying NOT NULL, 
            "checked" boolean NOT NULL DEFAULT false, 
            "userId" integer, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" 
            PRIMARY KEY ("id"))`
        );
        await queryRunner.query(`ALTER TABLE "notification" 
            ADD CONSTRAINT "FK_1ced25315eb974b73391fb1c81b" FOREIGN KEY 
            ("userId") REFERENCES "user"("id") 
            ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_1ced25315eb974b73391fb1c81b"`);
        await queryRunner.query(`DROP TABLE "notification"`);
    }

}
