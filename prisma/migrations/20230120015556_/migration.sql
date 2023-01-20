/*
  Warnings:

  - You are about to drop the column `followers` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `following` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `provienceID` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "followers",
DROP COLUMN "following",
DROP COLUMN "provienceID";
