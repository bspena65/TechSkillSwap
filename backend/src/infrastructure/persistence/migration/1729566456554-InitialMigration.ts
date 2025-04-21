import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1729566456554 implements MigrationInterface {
    name = 'InitialMigration1729566456554'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Roles" ("id" SERIAL NOT NULL, "role_name" character varying(50) NOT NULL, CONSTRAINT "UQ_df6dd2268273551ea42f4ee1d2b" UNIQUE ("role_name"), CONSTRAINT "PK_efba48c6a0c7a9b6260f771b165" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "UserRoles" ("id" SERIAL NOT NULL, "userId" integer, "roleId" integer, CONSTRAINT "PK_a44a2382829972daa2a31345f56" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Languages" ("id" SERIAL NOT NULL, "language_name" character varying(50) NOT NULL, CONSTRAINT "UQ_0ffa0b529779b7e29a657193818" UNIQUE ("language_name"), CONSTRAINT "PK_233ebfdefa0ca52e27832267429" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "UserLanguages" ("id" SERIAL NOT NULL, "proficiency_level" character varying(50), "years_of_experience" integer, "userId" integer, "languageId" integer, CONSTRAINT "PK_caf82b17654815c4151b6ae1e6f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "SkillCategories" ("id" SERIAL NOT NULL, "category_name" character varying(100) NOT NULL, CONSTRAINT "UQ_7b3b08d25e73ac0ea063e401fbd" UNIQUE ("category_name"), CONSTRAINT "PK_45c54a379a91333ea713e9a844b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Skills" ("id" SERIAL NOT NULL, "skill_name" character varying(100) NOT NULL, "categoryId" integer, CONSTRAINT "UQ_1b36775b0eb4032b773d8bf5999" UNIQUE ("skill_name"), CONSTRAINT "PK_2f371d611f4a29288e11c9b628e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "UserSkills" ("id" SERIAL NOT NULL, "description" text, "years_of_experience" integer, "userId" integer, "skillId" integer, CONSTRAINT "PK_421946b3d2c7af6b2bb8a0efad4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Ratings" ("id" SERIAL NOT NULL, "rate" numeric(2,1) NOT NULL DEFAULT '0', "message" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "ownerCalificateId" integer, "calificatorId" integer, CONSTRAINT "PK_ee6436ff188c9bb00cc70fc447a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ChatParticipants" ("id" SERIAL NOT NULL, "joined_at" TIMESTAMP NOT NULL DEFAULT now(), "chatId" integer, "userId" integer, "ratingId" integer, CONSTRAINT "UQ_4cc4354726408a6b54ed4a08052" UNIQUE ("chatId", "userId"), CONSTRAINT "REL_95d55c01c3b2c5b4ced682e052" UNIQUE ("ratingId"), CONSTRAINT "PK_46c1dcdd0605b07dab5bde61986" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Messages" ("id" SERIAL NOT NULL, "content" text NOT NULL, "sent_at" TIMESTAMP NOT NULL DEFAULT now(), "chatId" integer, "senderId" integer, CONSTRAINT "PK_ecc722506c4b974388431745e8b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_919cc5bc35e27c3c61643fd835" ON "Messages" ("chatId") `);
        await queryRunner.query(`CREATE TYPE "public"."Chats_status_enum" AS ENUM('active', 'inactive', 'archived')`);
        await queryRunner.query(`CREATE TABLE "Chats" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "status" "public"."Chats_status_enum" NOT NULL DEFAULT 'active', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_64c36c2b8d86a0d5de4cf64de8d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "FriendRequests" ("id" SERIAL NOT NULL, "status" character varying(50) NOT NULL, "message" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "response_at" TIMESTAMP, "senderId" integer, "receiverId" integer, "skillSenderId" integer, "skillReceiverId" integer, "chatId" integer, CONSTRAINT "PK_7ad025745497d23f8e8f67c5115" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "UserProfessionalStudies" ("study_id" SERIAL NOT NULL, "degree" character varying(100) NOT NULL, "institution" character varying(100), "start_date" date, "end_date" date, "description" text, "level_study" text, "state" text, "userId" integer, CONSTRAINT "PK_42530e2666e9d8e7cfab4314ed0" PRIMARY KEY ("study_id"))`);
        await queryRunner.query(`CREATE TABLE "Users" ("id" SERIAL NOT NULL, "first_name" character varying(50) NOT NULL, "last_name" character varying(50) NOT NULL, "location" text, "label_profile" text, "email" character varying(100) NOT NULL, "password_hash" character varying(255) NOT NULL, "profile_picture_url" text, "bio" text, "auth_provider" character varying(50), "auth_provider_id" character varying(255), CONSTRAINT "UQ_3c3ab3f49a87e6ddb607f3c4945" UNIQUE ("email"), CONSTRAINT "PK_16d4f7d636df336db11d87413e3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Meetings" ("id" SERIAL NOT NULL, "title" character varying(100) NOT NULL, "description" text, "start_time" TIMESTAMP NOT NULL, "end_time" TIMESTAMP NOT NULL, "meet_link" character varying(255), "status" character varying(50) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "organizer_id" integer, "chat_id" integer, CONSTRAINT "PK_b6bef0e8c793f404cfb5af9493d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "UserRoles" ADD CONSTRAINT "FK_a6b832f61ba4bd959c838a1953b" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "UserRoles" ADD CONSTRAINT "FK_5f1d6fdea1024424fd60b193b9f" FOREIGN KEY ("roleId") REFERENCES "Roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "UserLanguages" ADD CONSTRAINT "FK_ce72485aad4bcc57a16edfc4492" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "UserLanguages" ADD CONSTRAINT "FK_2d690db4ec3877d6fa3dcbdcbad" FOREIGN KEY ("languageId") REFERENCES "Languages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Skills" ADD CONSTRAINT "FK_7099f63afdcc7e4cfd738c342a8" FOREIGN KEY ("categoryId") REFERENCES "SkillCategories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "UserSkills" ADD CONSTRAINT "FK_c53f593559c18c62eeba8e83ac4" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "UserSkills" ADD CONSTRAINT "FK_4e8c7cdb541adc4d156def02564" FOREIGN KEY ("skillId") REFERENCES "Skills"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Ratings" ADD CONSTRAINT "FK_e6c6bfe4d971a7bde56add08964" FOREIGN KEY ("ownerCalificateId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Ratings" ADD CONSTRAINT "FK_09140a724ea25f3f0d410b84d07" FOREIGN KEY ("calificatorId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ChatParticipants" ADD CONSTRAINT "FK_e596e3776d98d2d57a023a837d8" FOREIGN KEY ("chatId") REFERENCES "Chats"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ChatParticipants" ADD CONSTRAINT "FK_ecde36473541f84b52f7f907e14" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ChatParticipants" ADD CONSTRAINT "FK_95d55c01c3b2c5b4ced682e0524" FOREIGN KEY ("ratingId") REFERENCES "Ratings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Messages" ADD CONSTRAINT "FK_919cc5bc35e27c3c61643fd835e" FOREIGN KEY ("chatId") REFERENCES "Chats"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Messages" ADD CONSTRAINT "FK_b4f327890b06f4fd32a2697103c" FOREIGN KEY ("senderId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "FriendRequests" ADD CONSTRAINT "FK_82dd9c680bdcf15a0c1062c69cf" FOREIGN KEY ("senderId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "FriendRequests" ADD CONSTRAINT "FK_5b2f1fe0ddd7c85a61527d84ade" FOREIGN KEY ("receiverId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "FriendRequests" ADD CONSTRAINT "FK_9afa4c123ea6faaf3badbe12c6a" FOREIGN KEY ("skillSenderId") REFERENCES "Skills"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "FriendRequests" ADD CONSTRAINT "FK_fa0ad92e9df269d644101bbd1d6" FOREIGN KEY ("skillReceiverId") REFERENCES "Skills"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "FriendRequests" ADD CONSTRAINT "FK_6e0f7d42c8a91ebb5f6340b5a34" FOREIGN KEY ("chatId") REFERENCES "Chats"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "UserProfessionalStudies" ADD CONSTRAINT "FK_ab108ee48e9da88279243d285c5" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Meetings" ADD CONSTRAINT "FK_1bb6b385a78e3c84be6defbc49b" FOREIGN KEY ("organizer_id") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Meetings" ADD CONSTRAINT "FK_65c495b6b038fc86547c16ad7d1" FOREIGN KEY ("chat_id") REFERENCES "Chats"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Meetings" DROP CONSTRAINT "FK_65c495b6b038fc86547c16ad7d1"`);
        await queryRunner.query(`ALTER TABLE "Meetings" DROP CONSTRAINT "FK_1bb6b385a78e3c84be6defbc49b"`);
        await queryRunner.query(`ALTER TABLE "UserProfessionalStudies" DROP CONSTRAINT "FK_ab108ee48e9da88279243d285c5"`);
        await queryRunner.query(`ALTER TABLE "FriendRequests" DROP CONSTRAINT "FK_6e0f7d42c8a91ebb5f6340b5a34"`);
        await queryRunner.query(`ALTER TABLE "FriendRequests" DROP CONSTRAINT "FK_fa0ad92e9df269d644101bbd1d6"`);
        await queryRunner.query(`ALTER TABLE "FriendRequests" DROP CONSTRAINT "FK_9afa4c123ea6faaf3badbe12c6a"`);
        await queryRunner.query(`ALTER TABLE "FriendRequests" DROP CONSTRAINT "FK_5b2f1fe0ddd7c85a61527d84ade"`);
        await queryRunner.query(`ALTER TABLE "FriendRequests" DROP CONSTRAINT "FK_82dd9c680bdcf15a0c1062c69cf"`);
        await queryRunner.query(`ALTER TABLE "Messages" DROP CONSTRAINT "FK_b4f327890b06f4fd32a2697103c"`);
        await queryRunner.query(`ALTER TABLE "Messages" DROP CONSTRAINT "FK_919cc5bc35e27c3c61643fd835e"`);
        await queryRunner.query(`ALTER TABLE "ChatParticipants" DROP CONSTRAINT "FK_95d55c01c3b2c5b4ced682e0524"`);
        await queryRunner.query(`ALTER TABLE "ChatParticipants" DROP CONSTRAINT "FK_ecde36473541f84b52f7f907e14"`);
        await queryRunner.query(`ALTER TABLE "ChatParticipants" DROP CONSTRAINT "FK_e596e3776d98d2d57a023a837d8"`);
        await queryRunner.query(`ALTER TABLE "Ratings" DROP CONSTRAINT "FK_09140a724ea25f3f0d410b84d07"`);
        await queryRunner.query(`ALTER TABLE "Ratings" DROP CONSTRAINT "FK_e6c6bfe4d971a7bde56add08964"`);
        await queryRunner.query(`ALTER TABLE "UserSkills" DROP CONSTRAINT "FK_4e8c7cdb541adc4d156def02564"`);
        await queryRunner.query(`ALTER TABLE "UserSkills" DROP CONSTRAINT "FK_c53f593559c18c62eeba8e83ac4"`);
        await queryRunner.query(`ALTER TABLE "Skills" DROP CONSTRAINT "FK_7099f63afdcc7e4cfd738c342a8"`);
        await queryRunner.query(`ALTER TABLE "UserLanguages" DROP CONSTRAINT "FK_2d690db4ec3877d6fa3dcbdcbad"`);
        await queryRunner.query(`ALTER TABLE "UserLanguages" DROP CONSTRAINT "FK_ce72485aad4bcc57a16edfc4492"`);
        await queryRunner.query(`ALTER TABLE "UserRoles" DROP CONSTRAINT "FK_5f1d6fdea1024424fd60b193b9f"`);
        await queryRunner.query(`ALTER TABLE "UserRoles" DROP CONSTRAINT "FK_a6b832f61ba4bd959c838a1953b"`);
        await queryRunner.query(`DROP TABLE "Meetings"`);
        await queryRunner.query(`DROP TABLE "Users"`);
        await queryRunner.query(`DROP TABLE "UserProfessionalStudies"`);
        await queryRunner.query(`DROP TABLE "FriendRequests"`);
        await queryRunner.query(`DROP TABLE "Chats"`);
        await queryRunner.query(`DROP TYPE "public"."Chats_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_919cc5bc35e27c3c61643fd835"`);
        await queryRunner.query(`DROP TABLE "Messages"`);
        await queryRunner.query(`DROP TABLE "ChatParticipants"`);
        await queryRunner.query(`DROP TABLE "Ratings"`);
        await queryRunner.query(`DROP TABLE "UserSkills"`);
        await queryRunner.query(`DROP TABLE "Skills"`);
        await queryRunner.query(`DROP TABLE "SkillCategories"`);
        await queryRunner.query(`DROP TABLE "UserLanguages"`);
        await queryRunner.query(`DROP TABLE "Languages"`);
        await queryRunner.query(`DROP TABLE "UserRoles"`);
        await queryRunner.query(`DROP TABLE "Roles"`);
    }

}
