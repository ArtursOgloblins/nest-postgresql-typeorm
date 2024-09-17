import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBlogOwnerId1726073282184 implements MigrationInterface {
  name = 'AddBlogOwnerId1726073282184';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "blogs" ADD "blogOwnerId" integer NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "blogs" DROP COLUMN "blogOwnerId"`);
  }
}
