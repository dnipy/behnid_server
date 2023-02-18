/*
  Warnings:

  - You are about to drop the column `remittance` on the `MessageToGroup` table. All the data in the column will be lost.
  - You are about to drop the column `remittance` on the `message` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ChatType" AS ENUM ('remittance', 'message');

-- AlterTable
ALTER TABLE "MessageToGroup" DROP COLUMN "remittance",
ADD COLUMN     "messageType" "ChatType" NOT NULL DEFAULT 'message';

-- AlterTable
ALTER TABLE "message" DROP COLUMN "remittance",
ADD COLUMN     "messageType" "ChatType" NOT NULL DEFAULT 'message';
