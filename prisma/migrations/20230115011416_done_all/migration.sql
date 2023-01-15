-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('pending', 'rejected', 'accepted');

-- CreateEnum
CREATE TYPE "Rates" AS ENUM ('one', 'two', 'three', 'four', 'five', 'unset');

-- AlterTable
ALTER TABLE "FreeRequests" ADD COLUMN     "force" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "rejectReason" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "status" "RequestStatus" NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE "message" ADD COLUMN     "replyedTo" INTEGER,
ADD COLUMN     "requestId" INTEGER;

-- AlterTable
ALTER TABLE "sellerProfile" ADD COLUMN     "shopName" TEXT;

-- CreateTable
CREATE TABLE "commentsForSellers" (
    "id" SERIAL NOT NULL,
    "AuthorID" INTEGER,
    "message" TEXT NOT NULL DEFAULT '',
    "sellerID" INTEGER NOT NULL,
    "response" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "commentsForSellers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "retesForSellers" (
    "id" SERIAL NOT NULL,
    "AuthorID" INTEGER,
    "rates" "Rates" NOT NULL DEFAULT 'unset',
    "sellerID" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "retesForSellers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "commentsForSellers" ADD CONSTRAINT "commentsForSellers_AuthorID_fkey" FOREIGN KEY ("AuthorID") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commentsForSellers" ADD CONSTRAINT "commentsForSellers_sellerID_fkey" FOREIGN KEY ("sellerID") REFERENCES "sellerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "retesForSellers" ADD CONSTRAINT "retesForSellers_AuthorID_fkey" FOREIGN KEY ("AuthorID") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "retesForSellers" ADD CONSTRAINT "retesForSellers_sellerID_fkey" FOREIGN KEY ("sellerID") REFERENCES "sellerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "FreeRequests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
