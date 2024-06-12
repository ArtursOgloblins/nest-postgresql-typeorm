import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLikesEntity1717595873295 implements MigrationInterface {
    name = 'AddLikesEntity1717595873295'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."likes_status_enum" AS ENUM('Like', 'Dislike', 'None')`);
        await queryRunner.query(`CREATE TYPE "public"."likes_entitytype_enum" AS ENUM('Post', 'Comment')`);
        await queryRunner.query(`CREATE TABLE "likes" ("id" SERIAL NOT NULL, "status" "public"."likes_status_enum" NOT NULL DEFAULT 'None', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "entityType" "public"."likes_entitytype_enum" NOT NULL, "entityId" integer NOT NULL, "userId" integer, CONSTRAINT "PK_a9323de3f8bced7539a794b4a37" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "userLogin" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_e44ddaaa6d058cb4092f83ad61f"`);
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "postId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_e44ddaaa6d058cb4092f83ad61f" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_7e8d7c49f218ebb14314fdb3749" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "likes" ADD CONSTRAINT "FK_cfd8e81fac09d7339a32e57d904" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "likes" DROP CONSTRAINT "FK_cfd8e81fac09d7339a32e57d904"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_7e8d7c49f218ebb14314fdb3749"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_e44ddaaa6d058cb4092f83ad61f"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "userId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "postId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_e44ddaaa6d058cb4092f83ad61f" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "userLogin"`);
        await queryRunner.query(`DROP TABLE "likes"`);
        await queryRunner.query(`DROP TYPE "public"."likes_entitytype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."likes_status_enum"`);
    }

}
