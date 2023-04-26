/*
  Warnings:

  - You are about to drop the column `message` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `response` on the `Ticket` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "message",
DROP COLUMN "response";
