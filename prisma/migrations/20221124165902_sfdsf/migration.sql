/*
  Warnings:

  - The primary key for the `Connections` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `followerId` on the `Connections` table. All the data in the column will be lost.
  - You are about to drop the column `followingId` on the `Connections` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Connections" DROP CONSTRAINT "Connections_followerId_fkey";

-- DropForeignKey
ALTER TABLE "Connections" DROP CONSTRAINT "Connections_followingId_fkey";

-- AlterTable
ALTER TABLE "Connections" DROP CONSTRAINT "Connections_pkey",
DROP COLUMN "followerId",
DROP COLUMN "followingId",
ADD CONSTRAINT "Connections_pkey" PRIMARY KEY ("AuthorId");

-- CreateTable
CREATE TABLE "_follower" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_following" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_follower_AB_unique" ON "_follower"("A", "B");

-- CreateIndex
CREATE INDEX "_follower_B_index" ON "_follower"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_following_AB_unique" ON "_following"("A", "B");

-- CreateIndex
CREATE INDEX "_following_B_index" ON "_following"("B");

-- AddForeignKey
ALTER TABLE "_follower" ADD CONSTRAINT "_follower_A_fkey" FOREIGN KEY ("A") REFERENCES "Connections"("AuthorId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_follower" ADD CONSTRAINT "_follower_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_following" ADD CONSTRAINT "_following_A_fkey" FOREIGN KEY ("A") REFERENCES "Connections"("AuthorId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_following" ADD CONSTRAINT "_following_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
