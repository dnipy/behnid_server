/*
  Warnings:

  - A unique constraint covering the columns `[AuthorID]` on the table `retesForSellers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "retesForSellers_AuthorID_key" ON "retesForSellers"("AuthorID");
