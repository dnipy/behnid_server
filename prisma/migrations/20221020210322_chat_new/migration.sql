/*
  Warnings:

  - You are about to drop the column `senderName` on the `message` table. All the data in the column will be lost.
  - You are about to drop the `_ChatsToUser` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id,name]` on the table `Provience` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "_ChatsToUser" DROP CONSTRAINT "_ChatsToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ChatsToUser" DROP CONSTRAINT "_ChatsToUser_B_fkey";

-- DropForeignKey
ALTER TABLE "message" DROP CONSTRAINT "message_senderName_fkey";

-- AlterTable
ALTER TABLE "Chats" ADD COLUMN     "userOneId" INTEGER NOT NULL DEFAULT 7,
ADD COLUMN     "userTwoId" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "message" DROP COLUMN "senderName",
ADD COLUMN     "recieverId" INTEGER NOT NULL DEFAULT 7,
ADD COLUMN     "senderId" INTEGER NOT NULL DEFAULT 1;

-- DropTable
DROP TABLE "_ChatsToUser";

-- CreateIndex
CREATE UNIQUE INDEX "Provience_id_name_key" ON "Provience"("id", "name");

-- AddForeignKey
ALTER TABLE "Chats" ADD CONSTRAINT "Chats_userOneId_fkey" FOREIGN KEY ("userOneId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chats" ADD CONSTRAINT "Chats_userTwoId_fkey" FOREIGN KEY ("userTwoId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_recieverId_fkey" FOREIGN KEY ("recieverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
