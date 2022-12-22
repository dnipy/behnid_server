/*
  Warnings:

  - You are about to drop the column `subCatId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `Categorie` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CategoriesOnProducts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subCatOnCategories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CategoriesOnProducts" DROP CONSTRAINT "CategoriesOnProducts_categorisID_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_catID_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_subCatId_fkey";

-- DropForeignKey
ALTER TABLE "subCatOnCategories" DROP CONSTRAINT "subCatOnCategories_categoryID_fkey";

-- DropForeignKey
ALTER TABLE "subCatOnCategories" DROP CONSTRAINT "subCatOnCategories_subCategoryID_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "subCatId";

-- DropTable
DROP TABLE "Categorie";

-- DropTable
DROP TABLE "CategoriesOnProducts";

-- DropTable
DROP TABLE "subCatOnCategories";

-- DropTable
DROP TABLE "subCategory";

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CategoryToProduct" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToProduct_AB_unique" ON "_CategoryToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToProduct_B_index" ON "_CategoryToProduct"("B");

-- AddForeignKey
ALTER TABLE "_CategoryToProduct" ADD CONSTRAINT "_CategoryToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToProduct" ADD CONSTRAINT "_CategoryToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
