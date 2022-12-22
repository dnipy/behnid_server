/*
  Warnings:

  - A unique constraint covering the columns `[id,name]` on the table `Category` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Category_id_name_key" ON "Category"("id", "name");
