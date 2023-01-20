/*
  Warnings:

  - A unique constraint covering the columns `[shopURLname]` on the table `sellerProfile` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_authorID_fkey";

-- DropForeignKey
ALTER TABLE "stories" DROP CONSTRAINT "stories_authorID_authorName_fkey";

-- AlterTable
ALTER TABLE "sellerProfile" ADD COLUMN     "shopURLname" TEXT;

-- AlterTable
ALTER TABLE "stories" ADD COLUMN     "productID" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "sellerProfile_shopURLname_key" ON "sellerProfile"("shopURLname");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_authorID_fkey" FOREIGN KEY ("authorID") REFERENCES "sellerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stories" ADD CONSTRAINT "stories_authorID_fkey" FOREIGN KEY ("authorID") REFERENCES "sellerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stories" ADD CONSTRAINT "stories_productID_fkey" FOREIGN KEY ("productID") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
