-- AlterTable
ALTER TABLE "SpamCommentsOnBlog" ADD COLUMN     "author_phone" TEXT;

-- AlterTable
ALTER TABLE "SpamCommentsOnProducts" ADD COLUMN     "author_phone" TEXT;

-- AlterTable
ALTER TABLE "SpamCommentsOnSellers" ADD COLUMN     "author_phone" TEXT;

-- AlterTable
ALTER TABLE "SpamMessages" ADD COLUMN     "author_phone" TEXT;

-- AlterTable
ALTER TABLE "SpamProducts" ADD COLUMN     "author_phone" TEXT;

-- AlterTable
ALTER TABLE "SpamRequests" ADD COLUMN     "author_phone" TEXT;

-- AlterTable
ALTER TABLE "SpamSellers" ADD COLUMN     "author_phone" TEXT;

-- AlterTable
ALTER TABLE "SpamUsers" ADD COLUMN     "author_phone" TEXT;
