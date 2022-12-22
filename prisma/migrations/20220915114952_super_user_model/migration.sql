/*
  Warnings:

  - Added the required column `provienceId` to the `City` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provienceName` to the `City` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sellerStatus` to the `sellerProfile` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('pending', 'seen', 'done');

-- CreateEnum
CREATE TYPE "SellerStatus" AS ENUM ('pending', 'rejected', 'accepted', 'unAuthorized');

-- CreateEnum
CREATE TYPE "superUserRole" AS ENUM ('full_access', 'blog_admin', 'request_admin', 'ticket_admin', 'authorization');

-- AlterTable
ALTER TABLE "City" ADD COLUMN     "provienceId" INTEGER NOT NULL,
ADD COLUMN     "provienceName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "RequestOnProducts" ADD COLUMN     "message" TEXT;

-- AlterTable
ALTER TABLE "sellerProfile" ADD COLUMN     "sellerStatus" "SellerStatus" NOT NULL,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Ticket" (
    "id" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "status" "TicketStatus" NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Provience" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Provience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SuperUser" (
    "id" SERIAL NOT NULL,
    "email" TEXT,
    "phone" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "Role" "superUserRole" NOT NULL DEFAULT 'full_access',
    "avatar" TEXT,

    CONSTRAINT "SuperUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_userID_key" ON "Ticket"("userID");

-- CreateIndex
CREATE UNIQUE INDEX "Provience_name_id_key" ON "Provience"("name", "id");

-- CreateIndex
CREATE UNIQUE INDEX "SuperUser_email_key" ON "SuperUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SuperUser_phone_key" ON "SuperUser"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "SuperUser_name_key" ON "SuperUser"("name");

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "City" ADD CONSTRAINT "City_provienceId_provienceName_fkey" FOREIGN KEY ("provienceId", "provienceName") REFERENCES "Provience"("id", "name") ON DELETE RESTRICT ON UPDATE CASCADE;
