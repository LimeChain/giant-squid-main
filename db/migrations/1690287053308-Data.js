module.exports = class Data1690287053308 {
    name = 'Data1690287053308'

    async up(db) {
        await db.query(`CREATE TABLE "native_transfer" ("id" character varying NOT NULL, "block_number" integer NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "extrinsic_hash" text, "amount" numeric NOT NULL, "success" boolean NOT NULL, "from_id" character varying, "to_id" character varying, CONSTRAINT "PK_2c3c43fc41181e002fd0f3bcf0f" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_83b8a385501126ab1e5b3a6e38" ON "native_transfer" ("block_number") `)
        await db.query(`CREATE INDEX "IDX_9d32b6b7e940a49e91af2b7c8b" ON "native_transfer" ("timestamp") `)
        await db.query(`CREATE INDEX "IDX_cf97a8008dc22834e9e9d8596e" ON "native_transfer" ("extrinsic_hash") `)
        await db.query(`CREATE INDEX "IDX_dd3c998c07dabdafe827060b67" ON "native_transfer" ("from_id") `)
        await db.query(`CREATE INDEX "IDX_08861105fb579f4171e2e1d21d" ON "native_transfer" ("to_id") `)
        await db.query(`CREATE INDEX "IDX_9eb67c3d0502c44a06df7efbff" ON "native_transfer" ("amount") `)
        await db.query(`CREATE TABLE "transfer" ("id" character varying NOT NULL, "direction" character varying(4), "transfer_id" character varying, "account_id" character varying, CONSTRAINT "PK_fd9ddbdd49a17afcbe014401295" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_7aa3769048ff14716eb5e0939e" ON "transfer" ("transfer_id") `)
        await db.query(`CREATE INDEX "IDX_bc8d11fdb46573269220c45af5" ON "transfer" ("account_id") `)
        await db.query(`CREATE TABLE "staking_unlock_chunk" ("id" character varying NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "block_number" integer NOT NULL, "locked_until_era" integer NOT NULL, "amount" numeric NOT NULL, "withdrawn" boolean NOT NULL, "staker_id" character varying, CONSTRAINT "PK_8b61b896ffe18927e180f15d32c" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_e570a41acffb089d2a1ce309fd" ON "staking_unlock_chunk" ("block_number") `)
        await db.query(`CREATE INDEX "IDX_8b99b268555fa0db5a4483c169" ON "staking_unlock_chunk" ("staker_id") `)
        await db.query(`CREATE TABLE "staking_slash" ("id" character varying NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "block_number" integer NOT NULL, "extrinsic_hash" text, "amount" numeric NOT NULL, "account_id" character varying, "staker_id" character varying, CONSTRAINT "PK_3e74c2a899ae0f904f4142a4d3b" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_ec2e8474e4aa90af86a39814da" ON "staking_slash" ("block_number") `)
        await db.query(`CREATE INDEX "IDX_cad37e1e3ca51418cf3fc5268c" ON "staking_slash" ("extrinsic_hash") `)
        await db.query(`CREATE INDEX "IDX_73664be4d41309d8269a9e85af" ON "staking_slash" ("account_id") `)
        await db.query(`CREATE INDEX "IDX_3e9b7b304fd26d01b15bd6dccd" ON "staking_slash" ("staker_id") `)
        await db.query(`CREATE TABLE "staking_bond" ("id" character varying NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "block_number" integer NOT NULL, "extrinsic_hash" text, "amount" numeric NOT NULL, "account_id" character varying, "staker_id" character varying, CONSTRAINT "PK_35ead485d489a050c632728cdd9" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_942bbc0d8c966f77a26cb4b1cf" ON "staking_bond" ("block_number") `)
        await db.query(`CREATE INDEX "IDX_b38d17ce3a94eb771435464c20" ON "staking_bond" ("extrinsic_hash") `)
        await db.query(`CREATE INDEX "IDX_cf2a5fc4d501da37ec2c60b339" ON "staking_bond" ("account_id") `)
        await db.query(`CREATE INDEX "IDX_6dfbe050a4ef9c6b586906015e" ON "staking_bond" ("staker_id") `)
        await db.query(`CREATE TABLE "staker" ("id" character varying NOT NULL, "payee_type" character varying(10) NOT NULL, "active_bond" numeric NOT NULL, "total_bond" numeric NOT NULL, "total_reward" numeric NOT NULL, "total_slash" numeric NOT NULL, "role" character varying(9) NOT NULL, "data" jsonb, "is_killed" boolean NOT NULL, "stash_id" character varying, "controller_id" character varying, "payee_id" character varying, CONSTRAINT "REL_828b14269265a736e4fef52ce2" UNIQUE ("stash_id"), CONSTRAINT "REL_15b7e74748f940d0ccfbf21f1c" UNIQUE ("controller_id"), CONSTRAINT "PK_13561f691b22038cfa606fe1161" PRIMARY KEY ("id"))`)
        await db.query(`CREATE UNIQUE INDEX "IDX_828b14269265a736e4fef52ce2" ON "staker" ("stash_id") `)
        await db.query(`CREATE UNIQUE INDEX "IDX_15b7e74748f940d0ccfbf21f1c" ON "staker" ("controller_id") `)
        await db.query(`CREATE INDEX "IDX_1df4573c718e95292cd00f49c3" ON "staker" ("payee_id") `)
        await db.query(`CREATE TABLE "staking_era" ("id" character varying NOT NULL, "index" integer NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "status" character varying(7) NOT NULL, "started_at" integer NOT NULL, "ended_at" integer, "total" numeric NOT NULL, "validators_count" integer NOT NULL, "nominators_count" integer NOT NULL, CONSTRAINT "PK_dd74dd2d2d4b81ef3f7184c80ad" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "staking_era_nominator" ("id" character varying NOT NULL, "bonded" numeric NOT NULL, "era_reward" numeric NOT NULL, "staker_id" character varying, "era_id" character varying, CONSTRAINT "PK_18d3098391026ff0413079dae10" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_cb77b582f57892defdec13e8aa" ON "staking_era_nominator" ("staker_id") `)
        await db.query(`CREATE INDEX "IDX_edad8317913bf0e00ee0c26379" ON "staking_era_nominator" ("era_id") `)
        await db.query(`CREATE TABLE "staking_era_nomination" ("id" character varying NOT NULL, "vote" numeric NOT NULL, "era_id" character varying, "nominator_id" character varying, "validator_id" character varying, CONSTRAINT "PK_d1ce2e6d58ebf7053807bd6b272" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_ed499c65e19548d4f349537fe9" ON "staking_era_nomination" ("era_id") `)
        await db.query(`CREATE INDEX "IDX_cd4789cc12b46d50fc49dbccbe" ON "staking_era_nomination" ("nominator_id") `)
        await db.query(`CREATE INDEX "IDX_cb2e9954a7c5149a4ba735a768" ON "staking_era_nomination" ("validator_id") `)
        await db.query(`CREATE TABLE "staking_era_validator" ("id" character varying NOT NULL, "bonded" numeric NOT NULL, "total_bonded" numeric NOT NULL, "era_reward" numeric NOT NULL, "commission" integer, "staker_id" character varying, "era_id" character varying, CONSTRAINT "PK_605ce443a47c3fd9fff56ccf080" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_4e9dda11816f3cff08757719ba" ON "staking_era_validator" ("staker_id") `)
        await db.query(`CREATE INDEX "IDX_8356e80f170f7179763bb8f3f1" ON "staking_era_validator" ("era_id") `)
        await db.query(`CREATE TABLE "staking_reward" ("id" character varying NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "block_number" integer NOT NULL, "extrinsic_hash" text, "amount" numeric NOT NULL, "era" integer, "validator_id" character varying, "account_id" character varying, "staker_id" character varying, CONSTRAINT "PK_63b6754f195dbb71232f598485b" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_6d193d26e0c88588e594475ccf" ON "staking_reward" ("block_number") `)
        await db.query(`CREATE INDEX "IDX_9ac63742f246bfbc1b88a6545a" ON "staking_reward" ("extrinsic_hash") `)
        await db.query(`CREATE INDEX "IDX_a13699fe2651c6c2717a7076f5" ON "staking_reward" ("account_id") `)
        await db.query(`CREATE INDEX "IDX_e86bb960591aba47e7181760f2" ON "staking_reward" ("validator_id") `)
        await db.query(`CREATE INDEX "IDX_64fe4e1309be60aee5ff677a87" ON "staking_reward" ("staker_id") `)
        await db.query(`CREATE TABLE "identity_sub" ("id" character varying NOT NULL, "name" text, "super_id" character varying, "account_id" character varying, CONSTRAINT "REL_20df08516f386a2d403fe66150" UNIQUE ("account_id"), CONSTRAINT "PK_56b60575c4d8f8fa3caa1fbe92a" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_b3110339d38dddff279f6f7712" ON "identity_sub" ("super_id") `)
        await db.query(`CREATE UNIQUE INDEX "IDX_20df08516f386a2d403fe66150" ON "identity_sub" ("account_id") `)
        await db.query(`CREATE TABLE "identity" ("id" character varying NOT NULL, "judgement" character varying(10) NOT NULL, "additional" jsonb, "display" text, "legal" text, "web" text, "riot" text, "email" text, "pgp_fingerprint" text, "image" text, "twitter" text, "is_killed" boolean NOT NULL, "account_id" character varying, CONSTRAINT "REL_bafa9e6c71c3f69cef6602a809" UNIQUE ("account_id"), CONSTRAINT "PK_ff16a44186b286d5e626178f726" PRIMARY KEY ("id"))`)
        await db.query(`CREATE UNIQUE INDEX "IDX_bafa9e6c71c3f69cef6602a809" ON "identity" ("account_id") `)
        await db.query(`CREATE TABLE "account" ("id" character varying NOT NULL, "public_key" text NOT NULL, CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_34e5683537bbd7627b0e9469b8" ON "account" ("public_key") `)
        await db.query(`ALTER TABLE "native_transfer" ADD CONSTRAINT "FK_dd3c998c07dabdafe827060b67f" FOREIGN KEY ("from_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "native_transfer" ADD CONSTRAINT "FK_08861105fb579f4171e2e1d21d6" FOREIGN KEY ("to_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "transfer" ADD CONSTRAINT "FK_7aa3769048ff14716eb5e0939e1" FOREIGN KEY ("transfer_id") REFERENCES "native_transfer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "transfer" ADD CONSTRAINT "FK_bc8d11fdb46573269220c45af52" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "staking_unlock_chunk" ADD CONSTRAINT "FK_8b99b268555fa0db5a4483c1695" FOREIGN KEY ("staker_id") REFERENCES "staker"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "staking_slash" ADD CONSTRAINT "FK_73664be4d41309d8269a9e85afd" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "staking_slash" ADD CONSTRAINT "FK_3e9b7b304fd26d01b15bd6dccdb" FOREIGN KEY ("staker_id") REFERENCES "staker"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "staking_bond" ADD CONSTRAINT "FK_cf2a5fc4d501da37ec2c60b339c" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "staking_bond" ADD CONSTRAINT "FK_6dfbe050a4ef9c6b586906015e9" FOREIGN KEY ("staker_id") REFERENCES "staker"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "staker" ADD CONSTRAINT "FK_828b14269265a736e4fef52ce26" FOREIGN KEY ("stash_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "staker" ADD CONSTRAINT "FK_15b7e74748f940d0ccfbf21f1c0" FOREIGN KEY ("controller_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "staker" ADD CONSTRAINT "FK_1df4573c718e95292cd00f49c35" FOREIGN KEY ("payee_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "staking_era_nominator" ADD CONSTRAINT "FK_cb77b582f57892defdec13e8aa5" FOREIGN KEY ("staker_id") REFERENCES "staker"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "staking_era_nominator" ADD CONSTRAINT "FK_edad8317913bf0e00ee0c263796" FOREIGN KEY ("era_id") REFERENCES "staking_era"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "staking_era_nomination" ADD CONSTRAINT "FK_ed499c65e19548d4f349537fe91" FOREIGN KEY ("era_id") REFERENCES "staking_era"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "staking_era_nomination" ADD CONSTRAINT "FK_cd4789cc12b46d50fc49dbccbe2" FOREIGN KEY ("nominator_id") REFERENCES "staking_era_nominator"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "staking_era_nomination" ADD CONSTRAINT "FK_cb2e9954a7c5149a4ba735a7687" FOREIGN KEY ("validator_id") REFERENCES "staking_era_validator"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "staking_era_validator" ADD CONSTRAINT "FK_4e9dda11816f3cff08757719ba6" FOREIGN KEY ("staker_id") REFERENCES "staker"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "staking_era_validator" ADD CONSTRAINT "FK_8356e80f170f7179763bb8f3f14" FOREIGN KEY ("era_id") REFERENCES "staking_era"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "staking_reward" ADD CONSTRAINT "FK_a13699fe2651c6c2717a7076f57" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "staking_reward" ADD CONSTRAINT "FK_e86bb960591aba47e7181760f26" FOREIGN KEY ("validator_id") REFERENCES "staking_era_validator"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "staking_reward" ADD CONSTRAINT "FK_64fe4e1309be60aee5ff677a878" FOREIGN KEY ("staker_id") REFERENCES "staker"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "identity_sub" ADD CONSTRAINT "FK_b3110339d38dddff279f6f77127" FOREIGN KEY ("super_id") REFERENCES "identity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "identity_sub" ADD CONSTRAINT "FK_20df08516f386a2d403fe66150a" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "identity" ADD CONSTRAINT "FK_bafa9e6c71c3f69cef6602a8095" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "native_transfer"`)
        await db.query(`DROP INDEX "public"."IDX_83b8a385501126ab1e5b3a6e38"`)
        await db.query(`DROP INDEX "public"."IDX_9d32b6b7e940a49e91af2b7c8b"`)
        await db.query(`DROP INDEX "public"."IDX_cf97a8008dc22834e9e9d8596e"`)
        await db.query(`DROP INDEX "public"."IDX_dd3c998c07dabdafe827060b67"`)
        await db.query(`DROP INDEX "public"."IDX_08861105fb579f4171e2e1d21d"`)
        await db.query(`DROP INDEX "public"."IDX_9eb67c3d0502c44a06df7efbff"`)
        await db.query(`DROP TABLE "transfer"`)
        await db.query(`DROP INDEX "public"."IDX_7aa3769048ff14716eb5e0939e"`)
        await db.query(`DROP INDEX "public"."IDX_bc8d11fdb46573269220c45af5"`)
        await db.query(`DROP TABLE "staking_unlock_chunk"`)
        await db.query(`DROP INDEX "public"."IDX_e570a41acffb089d2a1ce309fd"`)
        await db.query(`DROP INDEX "public"."IDX_8b99b268555fa0db5a4483c169"`)
        await db.query(`DROP TABLE "staking_slash"`)
        await db.query(`DROP INDEX "public"."IDX_ec2e8474e4aa90af86a39814da"`)
        await db.query(`DROP INDEX "public"."IDX_cad37e1e3ca51418cf3fc5268c"`)
        await db.query(`DROP INDEX "public"."IDX_73664be4d41309d8269a9e85af"`)
        await db.query(`DROP INDEX "public"."IDX_3e9b7b304fd26d01b15bd6dccd"`)
        await db.query(`DROP TABLE "staking_bond"`)
        await db.query(`DROP INDEX "public"."IDX_942bbc0d8c966f77a26cb4b1cf"`)
        await db.query(`DROP INDEX "public"."IDX_b38d17ce3a94eb771435464c20"`)
        await db.query(`DROP INDEX "public"."IDX_cf2a5fc4d501da37ec2c60b339"`)
        await db.query(`DROP INDEX "public"."IDX_6dfbe050a4ef9c6b586906015e"`)
        await db.query(`DROP TABLE "staker"`)
        await db.query(`DROP INDEX "public"."IDX_828b14269265a736e4fef52ce2"`)
        await db.query(`DROP INDEX "public"."IDX_15b7e74748f940d0ccfbf21f1c"`)
        await db.query(`DROP INDEX "public"."IDX_1df4573c718e95292cd00f49c3"`)
        await db.query(`DROP TABLE "staking_era"`)
        await db.query(`DROP TABLE "staking_era_nominator"`)
        await db.query(`DROP INDEX "public"."IDX_cb77b582f57892defdec13e8aa"`)
        await db.query(`DROP INDEX "public"."IDX_edad8317913bf0e00ee0c26379"`)
        await db.query(`DROP TABLE "staking_era_nomination"`)
        await db.query(`DROP INDEX "public"."IDX_ed499c65e19548d4f349537fe9"`)
        await db.query(`DROP INDEX "public"."IDX_cd4789cc12b46d50fc49dbccbe"`)
        await db.query(`DROP INDEX "public"."IDX_cb2e9954a7c5149a4ba735a768"`)
        await db.query(`DROP TABLE "staking_era_validator"`)
        await db.query(`DROP INDEX "public"."IDX_4e9dda11816f3cff08757719ba"`)
        await db.query(`DROP INDEX "public"."IDX_8356e80f170f7179763bb8f3f1"`)
        await db.query(`DROP TABLE "staking_reward"`)
        await db.query(`DROP INDEX "public"."IDX_6d193d26e0c88588e594475ccf"`)
        await db.query(`DROP INDEX "public"."IDX_9ac63742f246bfbc1b88a6545a"`)
        await db.query(`DROP INDEX "public"."IDX_a13699fe2651c6c2717a7076f5"`)
        await db.query(`DROP INDEX "public"."IDX_e86bb960591aba47e7181760f2"`)
        await db.query(`DROP INDEX "public"."IDX_64fe4e1309be60aee5ff677a87"`)
        await db.query(`DROP TABLE "identity_sub"`)
        await db.query(`DROP INDEX "public"."IDX_b3110339d38dddff279f6f7712"`)
        await db.query(`DROP INDEX "public"."IDX_20df08516f386a2d403fe66150"`)
        await db.query(`DROP TABLE "identity"`)
        await db.query(`DROP INDEX "public"."IDX_bafa9e6c71c3f69cef6602a809"`)
        await db.query(`DROP TABLE "account"`)
        await db.query(`DROP INDEX "public"."IDX_34e5683537bbd7627b0e9469b8"`)
        await db.query(`ALTER TABLE "native_transfer" DROP CONSTRAINT "FK_dd3c998c07dabdafe827060b67f"`)
        await db.query(`ALTER TABLE "native_transfer" DROP CONSTRAINT "FK_08861105fb579f4171e2e1d21d6"`)
        await db.query(`ALTER TABLE "transfer" DROP CONSTRAINT "FK_7aa3769048ff14716eb5e0939e1"`)
        await db.query(`ALTER TABLE "transfer" DROP CONSTRAINT "FK_bc8d11fdb46573269220c45af52"`)
        await db.query(`ALTER TABLE "staking_unlock_chunk" DROP CONSTRAINT "FK_8b99b268555fa0db5a4483c1695"`)
        await db.query(`ALTER TABLE "staking_slash" DROP CONSTRAINT "FK_73664be4d41309d8269a9e85afd"`)
        await db.query(`ALTER TABLE "staking_slash" DROP CONSTRAINT "FK_3e9b7b304fd26d01b15bd6dccdb"`)
        await db.query(`ALTER TABLE "staking_bond" DROP CONSTRAINT "FK_cf2a5fc4d501da37ec2c60b339c"`)
        await db.query(`ALTER TABLE "staking_bond" DROP CONSTRAINT "FK_6dfbe050a4ef9c6b586906015e9"`)
        await db.query(`ALTER TABLE "staker" DROP CONSTRAINT "FK_828b14269265a736e4fef52ce26"`)
        await db.query(`ALTER TABLE "staker" DROP CONSTRAINT "FK_15b7e74748f940d0ccfbf21f1c0"`)
        await db.query(`ALTER TABLE "staker" DROP CONSTRAINT "FK_1df4573c718e95292cd00f49c35"`)
        await db.query(`ALTER TABLE "staking_era_nominator" DROP CONSTRAINT "FK_cb77b582f57892defdec13e8aa5"`)
        await db.query(`ALTER TABLE "staking_era_nominator" DROP CONSTRAINT "FK_edad8317913bf0e00ee0c263796"`)
        await db.query(`ALTER TABLE "staking_era_nomination" DROP CONSTRAINT "FK_ed499c65e19548d4f349537fe91"`)
        await db.query(`ALTER TABLE "staking_era_nomination" DROP CONSTRAINT "FK_cd4789cc12b46d50fc49dbccbe2"`)
        await db.query(`ALTER TABLE "staking_era_nomination" DROP CONSTRAINT "FK_cb2e9954a7c5149a4ba735a7687"`)
        await db.query(`ALTER TABLE "staking_era_validator" DROP CONSTRAINT "FK_4e9dda11816f3cff08757719ba6"`)
        await db.query(`ALTER TABLE "staking_era_validator" DROP CONSTRAINT "FK_8356e80f170f7179763bb8f3f14"`)
        await db.query(`ALTER TABLE "staking_reward" DROP CONSTRAINT "FK_a13699fe2651c6c2717a7076f57"`)
        await db.query(`ALTER TABLE "staking_reward" DROP CONSTRAINT "FK_e86bb960591aba47e7181760f26"`)
        await db.query(`ALTER TABLE "staking_reward" DROP CONSTRAINT "FK_64fe4e1309be60aee5ff677a878"`)
        await db.query(`ALTER TABLE "identity_sub" DROP CONSTRAINT "FK_b3110339d38dddff279f6f77127"`)
        await db.query(`ALTER TABLE "identity_sub" DROP CONSTRAINT "FK_20df08516f386a2d403fe66150a"`)
        await db.query(`ALTER TABLE "identity" DROP CONSTRAINT "FK_bafa9e6c71c3f69cef6602a8095"`)
    }
}