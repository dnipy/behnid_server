-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_userID_fkey";

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "title" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "CategoryId" INTEGER,
ADD COLUMN     "CategoryName" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_CategoryName_CategoryId_fkey" FOREIGN KEY ("CategoryName", "CategoryId") REFERENCES "Category"("name", "id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
