/*
  Warnings:

  - You are about to drop the column `sendArea` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "sendArea";

-- CreateTable
CREATE TABLE "picture" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "src" TEXT NOT NULL,

    CONSTRAINT "picture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProductTopicture" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_sendArea" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProductTopicture_AB_unique" ON "_ProductTopicture"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductTopicture_B_index" ON "_ProductTopicture"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_sendArea_AB_unique" ON "_sendArea"("A", "B");

-- CreateIndex
CREATE INDEX "_sendArea_B_index" ON "_sendArea"("B");

-- AddForeignKey
ALTER TABLE "_ProductTopicture" ADD CONSTRAINT "_ProductTopicture_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductTopicture" ADD CONSTRAINT "_ProductTopicture_B_fkey" FOREIGN KEY ("B") REFERENCES "picture"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_sendArea" ADD CONSTRAINT "_sendArea_A_fkey" FOREIGN KEY ("A") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_sendArea" ADD CONSTRAINT "_sendArea_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
