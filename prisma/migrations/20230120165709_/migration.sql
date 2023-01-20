/*
  Warnings:

  - You are about to drop the `_CategoryToProduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CategoryToProduct" DROP CONSTRAINT "_CategoryToProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToProduct" DROP CONSTRAINT "_CategoryToProduct_B_fkey";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "categorieID" INTEGER;

-- DropTable
DROP TABLE "_CategoryToProduct";

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categorieID_fkey" FOREIGN KEY ("categorieID") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
