/*
  Warnings:

  - A unique constraint covering the columns `[id,name]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone,email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "seenTime" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "stories" (
    "id" SERIAL NOT NULL,
    "authorID" INTEGER NOT NULL,
    "authorName" TEXT NOT NULL,

    CONSTRAINT "stories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_name_key" ON "User"("id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_email_key" ON "User"("phone", "email");

-- AddForeignKey
ALTER TABLE "stories" ADD CONSTRAINT "stories_authorID_authorName_fkey" FOREIGN KEY ("authorID", "authorName") REFERENCES "User"("id", "name") ON DELETE RESTRICT ON UPDATE CASCADE;
