/*
  Warnings:

  - Made the column `AuthorID` on table `retesForSellers` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "retesForSellers" ALTER COLUMN "AuthorID" SET NOT NULL;
