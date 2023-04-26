-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_responseBy_fkey";

-- CreateTable
CREATE TABLE "Ticketmessage" (
    "id" SERIAL NOT NULL,
    "ticketID" INTEGER NOT NULL,
    "userID" INTEGER,
    "adminID" INTEGER,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "text" TEXT,
    "hasSeen" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT DEFAULT '',
    "voice" TEXT DEFAULT '',
    "pdf" TEXT DEFAULT '',
    "file_orginal_name" TEXT DEFAULT '',
    "file_size" TEXT DEFAULT '',

    CONSTRAINT "Ticketmessage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Ticketmessage" ADD CONSTRAINT "Ticketmessage_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticketmessage" ADD CONSTRAINT "Ticketmessage_adminID_fkey" FOREIGN KEY ("adminID") REFERENCES "SuperUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticketmessage" ADD CONSTRAINT "Ticketmessage_ticketID_fkey" FOREIGN KEY ("ticketID") REFERENCES "Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;
