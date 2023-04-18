/*
  Warnings:

  - The values [sexual,bot] on the enum `SpamType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SpamType_new" AS ENUM ('violence', 'unethical', 'Phishing', 'inviteLink', 'Nuisance', 'racism');
ALTER TABLE "SpamCommentsOnProducts" ALTER COLUMN "spamType" DROP DEFAULT;
ALTER TABLE "SpamUsers" ALTER COLUMN "spamType" DROP DEFAULT;
ALTER TABLE "SpamMessages" ALTER COLUMN "spamType" DROP DEFAULT;
ALTER TABLE "SpamCommentsOnBlog" ALTER COLUMN "spamType" DROP DEFAULT;
ALTER TABLE "SpamRequests" ALTER COLUMN "spamType" DROP DEFAULT;
ALTER TABLE "SpamProducts" ALTER COLUMN "spamType" DROP DEFAULT;
ALTER TABLE "SpamCommentsOnSellers" ALTER COLUMN "spamType" DROP DEFAULT;
ALTER TABLE "SpamSellers" ALTER COLUMN "spamType" DROP DEFAULT;
ALTER TABLE "SpamProducts" ALTER COLUMN "spamType" TYPE "SpamType_new" USING ("spamType"::text::"SpamType_new");
ALTER TABLE "SpamMessages" ALTER COLUMN "spamType" TYPE "SpamType_new" USING ("spamType"::text::"SpamType_new");
ALTER TABLE "SpamRequests" ALTER COLUMN "spamType" TYPE "SpamType_new" USING ("spamType"::text::"SpamType_new");
ALTER TABLE "SpamUsers" ALTER COLUMN "spamType" TYPE "SpamType_new" USING ("spamType"::text::"SpamType_new");
ALTER TABLE "SpamSellers" ALTER COLUMN "spamType" TYPE "SpamType_new" USING ("spamType"::text::"SpamType_new");
ALTER TABLE "SpamCommentsOnBlog" ALTER COLUMN "spamType" TYPE "SpamType_new" USING ("spamType"::text::"SpamType_new");
ALTER TABLE "SpamCommentsOnProducts" ALTER COLUMN "spamType" TYPE "SpamType_new" USING ("spamType"::text::"SpamType_new");
ALTER TABLE "SpamCommentsOnSellers" ALTER COLUMN "spamType" TYPE "SpamType_new" USING ("spamType"::text::"SpamType_new");
ALTER TYPE "SpamType" RENAME TO "SpamType_old";
ALTER TYPE "SpamType_new" RENAME TO "SpamType";
DROP TYPE "SpamType_old";
ALTER TABLE "SpamCommentsOnProducts" ALTER COLUMN "spamType" SET DEFAULT 'violence';
ALTER TABLE "SpamUsers" ALTER COLUMN "spamType" SET DEFAULT 'violence';
ALTER TABLE "SpamMessages" ALTER COLUMN "spamType" SET DEFAULT 'violence';
ALTER TABLE "SpamCommentsOnBlog" ALTER COLUMN "spamType" SET DEFAULT 'violence';
ALTER TABLE "SpamRequests" ALTER COLUMN "spamType" SET DEFAULT 'violence';
ALTER TABLE "SpamProducts" ALTER COLUMN "spamType" SET DEFAULT 'violence';
ALTER TABLE "SpamCommentsOnSellers" ALTER COLUMN "spamType" SET DEFAULT 'violence';
ALTER TABLE "SpamSellers" ALTER COLUMN "spamType" SET DEFAULT 'violence';
COMMIT;
