import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddManagerAndManagedUsersRelationsToUserTable1687208576933
  implements MigrationInterface
{
  name = 'AddManagerAndManagedUsersRelationsToUserTable1687208576933';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "managerId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_df69481de1f438f2082e4d54749" FOREIGN KEY ("managerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_df69481de1f438f2082e4d54749"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "managerId"`);
  }
}
