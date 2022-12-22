/*
  Warnings:

  - A unique constraint covering the columns `[authorID]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Product_authorID_key" ON "Product"("authorID");
