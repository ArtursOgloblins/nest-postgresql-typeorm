import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateBlogOwnerIdColumn1726491169301 implements MigrationInterface {
    name = 'UpdateBlogOwnerIdColumn1726491169301'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blogs" DROP COLUMN "isMembership"`);
        await queryRunner.query(`ALTER TABLE "blogs" ADD CONSTRAINT "UQ_b268b482498922b47accba8f9c5" UNIQUE ("blogOwnerId")`);
        await queryRunner.query(`ALTER TABLE "blogs" ADD CONSTRAINT "FK_b268b482498922b47accba8f9c5" FOREIGN KEY ("blogOwnerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blogs" DROP CONSTRAINT "FK_b268b482498922b47accba8f9c5"`);
        await queryRunner.query(`ALTER TABLE "blogs" DROP CONSTRAINT "UQ_b268b482498922b47accba8f9c5"`);
        await queryRunner.query(`ALTER TABLE "blogs" ADD "isMembership" boolean NOT NULL DEFAULT false`);
    }

}
