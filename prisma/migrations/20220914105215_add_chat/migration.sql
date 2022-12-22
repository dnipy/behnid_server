/*
  Warnings:

  - You are about to drop the `Messages` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_authorID_fkey";

-- DropTable
DROP TABLE "Messages";

-- CreateTable
CREATE TABLE "Chats" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message" (
    "id" SERIAL NOT NULL,
    "chatID" INTEGER NOT NULL,
    "senderName" TEXT NOT NULL,

    CONSTRAINT "message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ChatsToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ChatsToUser_AB_unique" ON "_ChatsToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ChatsToUser_B_index" ON "_ChatsToUser"("B");

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_senderName_fkey" FOREIGN KEY ("senderName") REFERENCES "User"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_chatID_fkey" FOREIGN KEY ("chatID") REFERENCES "Chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatsToUser" ADD CONSTRAINT "_ChatsToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatsToUser" ADD CONSTRAINT "_ChatsToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
