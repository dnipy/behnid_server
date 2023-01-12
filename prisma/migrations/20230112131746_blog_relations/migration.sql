/*
  Warnings:

  - You are about to drop the column `BlogID` on the `CategoryForBlog` table. All the data in the column will be lost.
  - You are about to drop the column `blogID` on the `keywordForBlog` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "CategoryForBlog" DROP CONSTRAINT "CategoryForBlog_BlogID_fkey";

-- DropForeignKey
ALTER TABLE "keywordForBlog" DROP CONSTRAINT "keywordForBlog_blogID_fkey";

-- AlterTable
ALTER TABLE "CategoryForBlog" DROP COLUMN "BlogID";

-- AlterTable
ALTER TABLE "keywordForBlog" DROP COLUMN "blogID";

-- CreateTable
CREATE TABLE "_BlogTokeywordForBlog" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_BlogToCategoryForBlog" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BlogTokeywordForBlog_AB_unique" ON "_BlogTokeywordForBlog"("A", "B");

-- CreateIndex
CREATE INDEX "_BlogTokeywordForBlog_B_index" ON "_BlogTokeywordForBlog"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BlogToCategoryForBlog_AB_unique" ON "_BlogToCategoryForBlog"("A", "B");

-- CreateIndex
CREATE INDEX "_BlogToCategoryForBlog_B_index" ON "_BlogToCategoryForBlog"("B");

-- AddForeignKey
ALTER TABLE "_BlogTokeywordForBlog" ADD CONSTRAINT "_BlogTokeywordForBlog_A_fkey" FOREIGN KEY ("A") REFERENCES "Blog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlogTokeywordForBlog" ADD CONSTRAINT "_BlogTokeywordForBlog_B_fkey" FOREIGN KEY ("B") REFERENCES "keywordForBlog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlogToCategoryForBlog" ADD CONSTRAINT "_BlogToCategoryForBlog_A_fkey" FOREIGN KEY ("A") REFERENCES "Blog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlogToCategoryForBlog" ADD CONSTRAINT "_BlogToCategoryForBlog_B_fkey" FOREIGN KEY ("B") REFERENCES "CategoryForBlog"("id") ON DELETE CASCADE ON UPDATE CASCADE;
