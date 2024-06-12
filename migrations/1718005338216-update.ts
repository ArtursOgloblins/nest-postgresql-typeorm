import { MigrationInterface, QueryRunner } from "typeorm";

export class Update1718005338216 implements MigrationInterface {
    name = 'Update1718005338216'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "blogName" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "title" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "title" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "blogName" SET DEFAULT false`);
    }

}
