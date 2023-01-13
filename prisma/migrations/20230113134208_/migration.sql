/*
  Warnings:

  - You are about to drop the column `CategoryId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `CategoryName` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_CategoryName_CategoryId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "CategoryId",
DROP COLUMN "CategoryName";

-- AlterTable
ALTER TABLE "sellerProfile" ADD COLUMN     "CategoryId" INTEGER,
ADD COLUMN     "CategoryName" TEXT;

-- AddForeignKey
ALTER TABLE "sellerProfile" ADD CONSTRAINT "sellerProfile_CategoryName_CategoryId_fkey" FOREIGN KEY ("CategoryName", "CategoryId") REFERENCES "Category"("name", "id") ON DELETE SET NULL ON UPDATE CASCADE;
