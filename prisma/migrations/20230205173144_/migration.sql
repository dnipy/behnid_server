/*
  Warnings:

  - Added the required column `avatar` to the `ChatGroup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `describe` to the `ChatGroup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `ChatGroup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ChatGroup" ADD COLUMN     "avatar" TEXT NOT NULL,
ADD COLUMN     "describe" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;
