import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsmembershipToBlogs1726496086758 implements MigrationInterface {
    name = 'AddIsmembershipToBlogs1726496086758'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blogs" ADD "isMembership" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blogs" DROP COLUMN "isMembership"`);
    }

}
