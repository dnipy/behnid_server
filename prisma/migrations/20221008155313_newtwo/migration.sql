/*
  Warnings:

  - You are about to drop the `Follows` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id,name]` on the table `City` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `shopIntro` to the `sellerProfile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Follows" DROP CONSTRAINT "Follows_followerId_fkey";

-- DropForeignKey
ALTER TABLE "Follows" DROP CONSTRAINT "Follows_followingId_fkey";

-- DropForeignKey
ALTER TABLE "message" DROP CONSTRAINT "message_chatID_fkey";

-- DropForeignKey
ALTER TABLE "message" DROP CONSTRAINT "message_senderName_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "cityID" INTEGER,
ADD COLUMN     "cityName" TEXT;

-- AlterTable
ALTER TABLE "commentsForBlog" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "commentsForProducts" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "sellerProfile" ADD COLUMN     "cityID" INTEGER,
ADD COLUMN     "shopIntro" TEXT NOT NULL;

-- DropTable
DROP TABLE "Follows";

-- CreateTable
CREATE TABLE "commentsForProductsComments" (
    "id" SERIAL NOT NULL,
    "AuthorID" INTEGER,
    "commentID" INTEGER,
    "message" TEXT NOT NULL DEFAULT '',
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "commentsForProductsComments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commentsForBlogComments" (
    "id" SERIAL NOT NULL,
    "AuthorID" INTEGER,
    "commentID" INTEGER,
    "message" TEXT NOT NULL DEFAULT '',
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "commentsForBlogComments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "passwdReset" (
    "id" SERIAL NOT NULL,
    "phone" TEXT NOT NULL,
    "verifyCode" TEXT NOT NULL,

    CONSTRAINT "passwdReset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "passwdReset_phone_key" ON "passwdReset"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "City_id_name_key" ON "City"("id", "name");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_cityID_cityName_fkey" FOREIGN KEY ("cityID", "cityName") REFERENCES "City"("id", "name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sellerProfile" ADD CONSTRAINT "sellerProfile_cityID_fkey" FOREIGN KEY ("cityID") REFERENCES "City"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commentsForProductsComments" ADD CONSTRAINT "commentsForProductsComments_AuthorID_fkey" FOREIGN KEY ("AuthorID") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commentsForProductsComments" ADD CONSTRAINT "commentsForProductsComments_commentID_fkey" FOREIGN KEY ("commentID") REFERENCES "commentsForProducts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commentsForBlogComments" ADD CONSTRAINT "commentsForBlogComments_AuthorID_fkey" FOREIGN KEY ("AuthorID") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commentsForBlogComments" ADD CONSTRAINT "commentsForBlogComments_commentID_fkey" FOREIGN KEY ("commentID") REFERENCES "commentsForBlog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_senderName_fkey" FOREIGN KEY ("senderName") REFERENCES "User"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_chatID_fkey" FOREIGN KEY ("chatID") REFERENCES "Chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;
