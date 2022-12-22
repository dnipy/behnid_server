/*
  Warnings:

  - You are about to drop the column `userID` on the `Contacts` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userPhone]` on the table `Contacts` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Contacts" DROP CONSTRAINT "Contacts_userID_fkey";

-- DropIndex
DROP INDEX "Contacts_userID_key";

-- AlterTable
ALTER TABLE "Contacts" DROP COLUMN "userID",
ADD COLUMN     "userPhone" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "Contacts_userPhone_key" ON "Contacts"("userPhone");

-- AddForeignKey
ALTER TABLE "Contacts" ADD CONSTRAINT "Contacts_userPhone_fkey" FOREIGN KEY ("userPhone") REFERENCES "User"("phone") ON DELETE RESTRICT ON UPDATE CASCADE;
