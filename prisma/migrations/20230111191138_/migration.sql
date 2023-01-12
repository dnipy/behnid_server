/*
  Warnings:

  - You are about to drop the column `provienceName` on the `City` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "City" DROP CONSTRAINT "City_provienceId_provienceName_fkey";

-- AlterTable
ALTER TABLE "City" DROP COLUMN "provienceName";

-- AddForeignKey
ALTER TABLE "City" ADD CONSTRAINT "City_provienceId_fkey" FOREIGN KEY ("provienceId") REFERENCES "Provience"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
