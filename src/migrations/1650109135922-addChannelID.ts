import {MigrationInterface, QueryRunner} from "typeorm";

export class addChannelID1650109135922 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT INTO "rule" ("senderID","ForwardedFrom","type","channelID","workspaceId")
        VALUES (NULL,NULL,'DevopsAws','C024PP941PA',2);`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "rule" WHERE "channelID" = 'C024PP941PA' AND "type" = 'DevopsAws' AND "workspaceId"=2;`);
    }

}
