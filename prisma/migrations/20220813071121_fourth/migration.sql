/*
  Warnings:

  - The `packType` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "packType" AS ENUM ('vanet', 'camiun', 'kg');

-- DropForeignKey
ALTER TABLE "CategoriesOnProducts" DROP CONSTRAINT "CategoriesOnProducts_productID_fkey";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "catID" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "subCatId" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "packType",
ADD COLUMN     "packType" "packType" NOT NULL DEFAULT 'vanet';

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_catID_fkey" FOREIGN KEY ("catID") REFERENCES "Categorie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_subCatId_fkey" FOREIGN KEY ("subCatId") REFERENCES "subCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
