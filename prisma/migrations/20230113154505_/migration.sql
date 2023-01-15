/*
  Warnings:

  - You are about to drop the column `image` on the `FreeRequests` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "stories" DROP CONSTRAINT "stories_authorID_authorName_fkey";

-- AlterTable
ALTER TABLE "FreeRequests" DROP COLUMN "image",
ADD COLUMN     "packType" "packType" NOT NULL DEFAULT 'kg';

-- AlterTable
ALTER TABLE "message" ADD COLUMN     "liked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pdf" TEXT DEFAULT '',
ADD COLUMN     "productId" INTEGER;

-- AlterTable
ALTER TABLE "sellerProfile" ADD COLUMN     "site_header" TEXT;

-- CreateTable
CREATE TABLE "keywordForFreeRequests" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "requestId" INTEGER NOT NULL,

    CONSTRAINT "keywordForFreeRequests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "keywordForProducts" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "keywordForProducts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_story_seen" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_savedProducts" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_story_seen_AB_unique" ON "_story_seen"("A", "B");

-- CreateIndex
CREATE INDEX "_story_seen_B_index" ON "_story_seen"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_savedProducts_AB_unique" ON "_savedProducts"("A", "B");

-- CreateIndex
CREATE INDEX "_savedProducts_B_index" ON "_savedProducts"("B");

-- AddForeignKey
ALTER TABLE "stories" ADD CONSTRAINT "stories_authorID_authorName_fkey" FOREIGN KEY ("authorID", "authorName") REFERENCES "User"("id", "name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "keywordForFreeRequests" ADD CONSTRAINT "keywordForFreeRequests_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "FreeRequests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "keywordForProducts" ADD CONSTRAINT "keywordForProducts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_story_seen" ADD CONSTRAINT "_story_seen_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_story_seen" ADD CONSTRAINT "_story_seen_B_fkey" FOREIGN KEY ("B") REFERENCES "stories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_savedProducts" ADD CONSTRAINT "_savedProducts_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_savedProducts" ADD CONSTRAINT "_savedProducts_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
