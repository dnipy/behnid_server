-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "subCatId" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "subCatName" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "rejectReason" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "MainCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "MainCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "mainCatName" TEXT NOT NULL DEFAULT '',
    "mainCatId" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "SubCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MainCategory_name_key" ON "MainCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MainCategory_id_name_key" ON "MainCategory"("id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "SubCategory_name_key" ON "SubCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SubCategory_id_name_key" ON "SubCategory"("id", "name");

-- AddForeignKey
ALTER TABLE "SubCategory" ADD CONSTRAINT "SubCategory_mainCatName_mainCatId_fkey" FOREIGN KEY ("mainCatName", "mainCatId") REFERENCES "MainCategory"("name", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_subCatName_subCatId_fkey" FOREIGN KEY ("subCatName", "subCatId") REFERENCES "SubCategory"("name", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
