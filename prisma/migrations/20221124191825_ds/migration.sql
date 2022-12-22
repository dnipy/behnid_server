-- AlterTable
ALTER TABLE "Blog" ADD COLUMN     "authorId" INTEGER;

-- AlterTable
ALTER TABLE "SuperUser" ADD COLUMN     "address" TEXT;

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "responseBy" INTEGER;

-- AlterTable
ALTER TABLE "message" ALTER COLUMN "text" DROP NOT NULL;

-- CreateTable
CREATE TABLE "_acceptedBy" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_acceptedBy_AB_unique" ON "_acceptedBy"("A", "B");

-- CreateIndex
CREATE INDEX "_acceptedBy_B_index" ON "_acceptedBy"("B");

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_responseBy_fkey" FOREIGN KEY ("responseBy") REFERENCES "SuperUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_id_fkey" FOREIGN KEY ("id") REFERENCES "SuperUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_acceptedBy" ADD CONSTRAINT "_acceptedBy_A_fkey" FOREIGN KEY ("A") REFERENCES "FreeRequests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_acceptedBy" ADD CONSTRAINT "_acceptedBy_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
