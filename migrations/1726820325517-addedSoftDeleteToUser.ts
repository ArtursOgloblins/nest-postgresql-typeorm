import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedSoftDeleteToUser1726820325517 implements MigrationInterface {
    name = 'AddedSoftDeleteToUser1726820325517'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "isDeleted" TO "deletedAt"`);
        await queryRunner.query(`CREATE TABLE "user_bans" ("id" SERIAL NOT NULL, "banReason" character varying NOT NULL, "bannedAt" TIMESTAMP NOT NULL DEFAULT now(), "isActiveBan" boolean NOT NULL DEFAULT false, "userId" integer, CONSTRAINT "PK_299b3ce7e72a9ac9aec5edeaf81" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "user_bans" ADD CONSTRAINT "FK_92ac403b4ae72ccffb7a551c5a5" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_bans" DROP CONSTRAINT "FK_92ac403b4ae72ccffb7a551c5a5"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "deletedAt" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`DROP TABLE "user_bans"`);
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "deletedAt" TO "isDeleted"`);
    }

}
