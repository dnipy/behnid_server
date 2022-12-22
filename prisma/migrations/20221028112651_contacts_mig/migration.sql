-- CreateTable
CREATE TABLE "Contacts" (
    "id" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "contactName" TEXT,
    "contactNumber" TEXT,

    CONSTRAINT "Contacts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Contacts_userID_key" ON "Contacts"("userID");

-- AddForeignKey
ALTER TABLE "Contacts" ADD CONSTRAINT "Contacts_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
