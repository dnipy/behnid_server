-- AlterTable
ALTER TABLE "message" ADD COLUMN     "remittance" TEXT DEFAULT '';

-- AlterTable
ALTER TABLE "sellerProfile" ADD COLUMN     "responseTime" TEXT;

-- CreateTable
CREATE TABLE "ChatGroup" (
    "id" SERIAL NOT NULL,
    "group_Author_id" INTEGER NOT NULL,

    CONSTRAINT "ChatGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageToGroup" (
    "id" SERIAL NOT NULL,
    "chatID" INTEGER NOT NULL,
    "senderId" INTEGER NOT NULL,
    "image" TEXT DEFAULT '',
    "remittance" TEXT DEFAULT '',
    "voice" TEXT DEFAULT '',
    "pdf" TEXT DEFAULT '',
    "text" TEXT,
    "replyedTo" INTEGER,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hasSeen" BOOLEAN NOT NULL DEFAULT false,
    "liked" BOOLEAN NOT NULL DEFAULT false,
    "productId" INTEGER,
    "requestId" INTEGER,

    CONSTRAINT "MessageToGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ChatGroupToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ChatGroup_group_Author_id_key" ON "ChatGroup"("group_Author_id");

-- CreateIndex
CREATE UNIQUE INDEX "_ChatGroupToUser_AB_unique" ON "_ChatGroupToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ChatGroupToUser_B_index" ON "_ChatGroupToUser"("B");

-- AddForeignKey
ALTER TABLE "ChatGroup" ADD CONSTRAINT "ChatGroup_group_Author_id_fkey" FOREIGN KEY ("group_Author_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageToGroup" ADD CONSTRAINT "MessageToGroup_chatID_fkey" FOREIGN KEY ("chatID") REFERENCES "ChatGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageToGroup" ADD CONSTRAINT "MessageToGroup_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageToGroup" ADD CONSTRAINT "MessageToGroup_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageToGroup" ADD CONSTRAINT "MessageToGroup_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "FreeRequests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatGroupToUser" ADD CONSTRAINT "_ChatGroupToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "ChatGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatGroupToUser" ADD CONSTRAINT "_ChatGroupToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
