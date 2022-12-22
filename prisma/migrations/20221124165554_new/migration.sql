/*
  Warnings:

  - The primary key for the `Connections` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[AuthorId]` on the table `Connections` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `AuthorId` to the `Connections` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Connections" DROP CONSTRAINT "Connections_pkey",
ADD COLUMN     "AuthorId" INTEGER NOT NULL,
ADD CONSTRAINT "Connections_pkey" PRIMARY KEY ("followerId", "followingId", "AuthorId");

-- CreateIndex
CREATE UNIQUE INDEX "Connections_AuthorId_key" ON "Connections"("AuthorId");

-- AddForeignKey
ALTER TABLE "Connections" ADD CONSTRAINT "Connections_AuthorId_fkey" FOREIGN KEY ("AuthorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
