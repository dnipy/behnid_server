/*
  Warnings:

  - You are about to drop the column `categoryID` on the `FreeRequests` table. All the data in the column will be lost.
  - You are about to drop the column `catID` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `ImagesOnProducts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubCat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `imagesOnBlog` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "ImagesOnProducts" DROP CONSTRAINT "ImagesOnProducts_productID_fkey";

-- DropForeignKey
ALTER TABLE "SubCat" DROP CONSTRAINT "SubCat_CatID_fkey";

-- DropForeignKey
ALTER TABLE "imagesOnBlog" DROP CONSTRAINT "imagesOnBlog_blogID_fkey";

-- AlterTable
ALTER TABLE "FreeRequests" DROP COLUMN "categoryID",
ADD COLUMN     "cityId" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "catID",
ADD COLUMN     "cityId" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "ImagesOnProducts";

-- DropTable
DROP TABLE "SubCat";

-- DropTable
DROP TABLE "imagesOnBlog";

-- CreateTable
CREATE TABLE "City" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FreeRequests" ADD CONSTRAINT "FreeRequests_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;
