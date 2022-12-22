-- CreateTable
CREATE TABLE "subCatOnCategories" (
    "categoryID" INTEGER NOT NULL,
    "subCategoryID" INTEGER NOT NULL,

    CONSTRAINT "subCatOnCategories_pkey" PRIMARY KEY ("categoryID","subCategoryID")
);

-- CreateTable
CREATE TABLE "subCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "subCategory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "subCatOnCategories" ADD CONSTRAINT "subCatOnCategories_categoryID_fkey" FOREIGN KEY ("categoryID") REFERENCES "Categorie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subCatOnCategories" ADD CONSTRAINT "subCatOnCategories_subCategoryID_fkey" FOREIGN KEY ("subCategoryID") REFERENCES "subCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
