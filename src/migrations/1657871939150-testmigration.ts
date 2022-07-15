import { MigrationInterface, QueryRunner } from "typeorm"

export class testmigration1657871939150 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT INTO "workspace" ("name","userId","accessToken","team_id")
        VALUES ('test','test1','xoxb-123vdg','CD78490');`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "workspace" WHERE "userId" = 'test1';`);
    }

}
