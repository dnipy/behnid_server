-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_subCatName_subCatId_fkey";

-- DropForeignKey
ALTER TABLE "SubCategory" DROP CONSTRAINT "SubCategory_mainCatName_mainCatId_fkey";

-- AddForeignKey
ALTER TABLE "SubCategory" ADD CONSTRAINT "SubCategory_mainCatName_mainCatId_fkey" FOREIGN KEY ("mainCatName", "mainCatId") REFERENCES "MainCategory"("name", "id") ON DELETE CASCADE ON UPDATE CASCADE;
