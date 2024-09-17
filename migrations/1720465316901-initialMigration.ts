import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1720465316901 implements MigrationInterface {
    name = 'InitialMigration1720465316901'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_496bfbe3ba7cd11c8ea1190dda" ON "password_recovery" ("confirmationCode") `);
        await queryRunner.query(`CREATE INDEX "IDX_b5d765d6d98a87f3bb75d2a2d3" ON "refresh_token" ("ip") `);
        await queryRunner.query(`CREATE INDEX "IDX_b38c8203d43a8d64ab42e80453" ON "refresh_token" ("deviceId") `);
        await queryRunner.query(`CREATE INDEX "IDX_8e913e288156c133999341156a" ON "refresh_token" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_cfd8e81fac09d7339a32e57d90" ON "likes" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_08539aa5624a8e843bc0caafb2" ON "likes" ("entityType") `);
        await queryRunner.query(`CREATE INDEX "IDX_cb05f6e8d3c0da2ff03e645f85" ON "likes" ("entityId") `);
        await queryRunner.query(`CREATE INDEX "IDX_e44ddaaa6d058cb4092f83ad61" ON "comments" ("postId") `);
        await queryRunner.query(`CREATE INDEX "IDX_7e8d7c49f218ebb14314fdb374" ON "comments" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_55d9c167993fed3f375391c8e3" ON "posts" ("blogId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ae05faaa55c866130abef6e1fe" ON "posts" ("userId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_ae05faaa55c866130abef6e1fe"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_55d9c167993fed3f375391c8e3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7e8d7c49f218ebb14314fdb374"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e44ddaaa6d058cb4092f83ad61"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cb05f6e8d3c0da2ff03e645f85"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_08539aa5624a8e843bc0caafb2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cfd8e81fac09d7339a32e57d90"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8e913e288156c133999341156a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b38c8203d43a8d64ab42e80453"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b5d765d6d98a87f3bb75d2a2d3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_496bfbe3ba7cd11c8ea1190dda"`);
    }

}
