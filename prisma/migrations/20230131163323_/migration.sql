/*
  Warnings:

  - You are about to drop the column `offPercent` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "offPercent";

-- AlterTable
ALTER TABLE "sellerProfile" ADD COLUMN     "working_record" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "OFF" (
    "id" SERIAL NOT NULL,
    "off_percent" INTEGER NOT NULL,
    "off_count" INTEGER NOT NULL,

    CONSTRAINT "OFF_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_OFFToProduct" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_OFFToProduct_AB_unique" ON "_OFFToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_OFFToProduct_B_index" ON "_OFFToProduct"("B");

-- AddForeignKey
ALTER TABLE "_OFFToProduct" ADD CONSTRAINT "_OFFToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "OFF"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OFFToProduct" ADD CONSTRAINT "_OFFToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
