-- CreateTable
CREATE TABLE "Notifications" (
    "id" SERIAL NOT NULL,
    "AuthorId" INTEGER NOT NULL,
    "message" TEXT NOT NULL DEFAULT '',
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "seen" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Notifications_AuthorId_key" ON "Notifications"("AuthorId");

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_AuthorId_fkey" FOREIGN KEY ("AuthorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
