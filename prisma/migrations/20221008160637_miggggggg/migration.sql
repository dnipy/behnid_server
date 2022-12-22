-- AlterTable
ALTER TABLE "FreeRequests" ADD COLUMN     "seenTime" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "stories" ADD COLUMN     "imgSrc" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "seenTime" INTEGER NOT NULL DEFAULT 0;
