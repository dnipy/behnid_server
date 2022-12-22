/*
  Warnings:

  - You are about to drop the `follower` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `following` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "follower" DROP CONSTRAINT "follower_name_fkey";

-- DropForeignKey
ALTER TABLE "following" DROP CONSTRAINT "following_name_fkey";

-- DropTable
DROP TABLE "follower";

-- DropTable
DROP TABLE "following";

-- CreateTable
CREATE TABLE "Connections" (
    "followerId" INTEGER NOT NULL,
    "followingId" INTEGER NOT NULL,

    CONSTRAINT "Connections_pkey" PRIMARY KEY ("followerId","followingId")
);

-- AddForeignKey
ALTER TABLE "Connections" ADD CONSTRAINT "Connections_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Connections" ADD CONSTRAINT "Connections_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
