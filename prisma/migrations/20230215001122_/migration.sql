/*
  Warnings:

  - Added the required column `text` to the `stories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "stories" ADD COLUMN     "text" TEXT NOT NULL;
