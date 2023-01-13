/*
  Warnings:

  - You are about to drop the column `CategoryId` on the `sellerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `CategoryName` on the `sellerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `cityID` on the `sellerProfile` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "sellerProfile" DROP CONSTRAINT "sellerProfile_CategoryName_CategoryId_fkey";

-- DropForeignKey
ALTER TABLE "sellerProfile" DROP CONSTRAINT "sellerProfile_cityID_fkey";

-- AlterTable
ALTER TABLE "sellerProfile" DROP COLUMN "CategoryId",
DROP COLUMN "CategoryName",
DROP COLUMN "cityID";

-- CreateTable
CREATE TABLE "_CityTosellerProfile" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CategoryTosellerProfile" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CityTosellerProfile_AB_unique" ON "_CityTosellerProfile"("A", "B");

-- CreateIndex
CREATE INDEX "_CityTosellerProfile_B_index" ON "_CityTosellerProfile"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryTosellerProfile_AB_unique" ON "_CategoryTosellerProfile"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryTosellerProfile_B_index" ON "_CategoryTosellerProfile"("B");

-- AddForeignKey
ALTER TABLE "_CityTosellerProfile" ADD CONSTRAINT "_CityTosellerProfile_A_fkey" FOREIGN KEY ("A") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CityTosellerProfile" ADD CONSTRAINT "_CityTosellerProfile_B_fkey" FOREIGN KEY ("B") REFERENCES "sellerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryTosellerProfile" ADD CONSTRAINT "_CategoryTosellerProfile_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryTosellerProfile" ADD CONSTRAINT "_CategoryTosellerProfile_B_fkey" FOREIGN KEY ("B") REFERENCES "sellerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
