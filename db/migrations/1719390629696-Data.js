module.exports = class Data1719390629696 {
    name = 'Data1719390629696'

    async up(db) {
        await db.query(`CREATE TABLE "staking_slash" ("id" character varying NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "block_number" integer NOT NULL, "extrinsic_hash" text, "amount" numeric NOT NULL, "account_id" character varying, CONSTRAINT "PK_3e74c2a899ae0f904f4142a4d3b" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_ec2e8474e4aa90af86a39814da" ON "staking_slash" ("block_number") `)
        await db.query(`CREATE INDEX "IDX_cad37e1e3ca51418cf3fc5268c" ON "staking_slash" ("extrinsic_hash") `)
        await db.query(`CREATE INDEX "IDX_73664be4d41309d8269a9e85af" ON "staking_slash" ("account_id") `)
        await db.query(`ALTER TABLE "staking_slash" ADD CONSTRAINT "FK_73664be4d41309d8269a9e85afd" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "staking_slash"`)
        await db.query(`DROP INDEX "public"."IDX_ec2e8474e4aa90af86a39814da"`)
        await db.query(`DROP INDEX "public"."IDX_cad37e1e3ca51418cf3fc5268c"`)
        await db.query(`DROP INDEX "public"."IDX_73664be4d41309d8269a9e85af"`)
        await db.query(`ALTER TABLE "staking_slash" DROP CONSTRAINT "FK_73664be4d41309d8269a9e85afd"`)
    }
}
