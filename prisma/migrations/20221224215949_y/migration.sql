/*
  Warnings:

  - You are about to drop the column `cityId` on the `Product` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id,name]` on the table `City` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_cityId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_cityName_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "cityId",
ADD COLUMN     "cityName" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "City_id_name_key" ON "City"("id", "name");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_cityID_cityName_fkey" FOREIGN KEY ("cityID", "cityName") REFERENCES "City"("id", "name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_cityName_fkey" FOREIGN KEY ("cityName") REFERENCES "City"("name") ON DELETE CASCADE ON UPDATE CASCADE;
