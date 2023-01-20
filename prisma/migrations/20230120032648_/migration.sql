/*
  Warnings:

  - A unique constraint covering the columns `[userPhone]` on the table `sellerProfile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userPhone` to the `sellerProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sellerProfile" ADD COLUMN     "userPhone" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "sellerProfile_userPhone_key" ON "sellerProfile"("userPhone");
