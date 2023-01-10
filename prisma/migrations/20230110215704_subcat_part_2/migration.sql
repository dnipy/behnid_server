-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_subCatName_subCatId_fkey" FOREIGN KEY ("subCatName", "subCatId") REFERENCES "SubCategory"("name", "id") ON DELETE CASCADE ON UPDATE CASCADE;
