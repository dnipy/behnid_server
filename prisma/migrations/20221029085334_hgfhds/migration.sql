/*
  Warnings:

  - You are about to drop the column `userPhone` on the `Contacts` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Contacts" DROP CONSTRAINT "Contacts_userPhone_fkey";

-- DropIndex
DROP INDEX "Contacts_userPhone_key";

-- AlterTable
ALTER TABLE "Contacts" DROP COLUMN "userPhone",
ADD COLUMN     "user_Phone" TEXT;

-- AddForeignKey
ALTER TABLE "Contacts" ADD CONSTRAINT "Contacts_user_Phone_fkey" FOREIGN KEY ("user_Phone") REFERENCES "User"("phone") ON DELETE SET NULL ON UPDATE CASCADE;
