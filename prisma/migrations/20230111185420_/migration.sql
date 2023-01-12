/*
  Warnings:

  - You are about to drop the column `slug` on the `City` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Provience` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "City" DROP COLUMN "slug";

-- AlterTable
ALTER TABLE "Provience" DROP COLUMN "slug";
