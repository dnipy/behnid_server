/*
  Warnings:

  - You are about to drop the column `imgsrc` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "imgsrc",
ADD COLUMN     "image_2" TEXT,
ADD COLUMN     "image_3" TEXT;

-- CreateTable
CREATE TABLE "FAQ" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,

    CONSTRAINT "FAQ_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FAQToProduct" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FAQToProduct_AB_unique" ON "_FAQToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_FAQToProduct_B_index" ON "_FAQToProduct"("B");

-- AddForeignKey
ALTER TABLE "_FAQToProduct" ADD CONSTRAINT "_FAQToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "FAQ"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FAQToProduct" ADD CONSTRAINT "_FAQToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
