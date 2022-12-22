/*
  Warnings:

  - You are about to drop the `Request` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "commentsForBlog" ADD COLUMN     "AuthorID" INTEGER;

-- AlterTable
ALTER TABLE "commentsForProducts" ADD COLUMN     "AuthorID" INTEGER;

-- DropTable
DROP TABLE "Request";

-- CreateTable
CREATE TABLE "RequestOnProducts" (
    "id" SERIAL NOT NULL,
    "productID" INTEGER,
    "quantity" INTEGER NOT NULL,
    "AuthorID" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RequestOnProducts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FreeRequests" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "image" TEXT,
    "name" TEXT NOT NULL,
    "describe" TEXT NOT NULL,
    "categoryID" INTEGER NOT NULL,
    "authorID" INTEGER NOT NULL,

    CONSTRAINT "FreeRequests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CategoryToFreeRequests" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToFreeRequests_AB_unique" ON "_CategoryToFreeRequests"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToFreeRequests_B_index" ON "_CategoryToFreeRequests"("B");

-- AddForeignKey
ALTER TABLE "commentsForProducts" ADD CONSTRAINT "commentsForProducts_AuthorID_fkey" FOREIGN KEY ("AuthorID") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestOnProducts" ADD CONSTRAINT "RequestOnProducts_productID_fkey" FOREIGN KEY ("productID") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestOnProducts" ADD CONSTRAINT "RequestOnProducts_AuthorID_fkey" FOREIGN KEY ("AuthorID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FreeRequests" ADD CONSTRAINT "FreeRequests_authorID_fkey" FOREIGN KEY ("authorID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commentsForBlog" ADD CONSTRAINT "commentsForBlog_AuthorID_fkey" FOREIGN KEY ("AuthorID") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToFreeRequests" ADD CONSTRAINT "_CategoryToFreeRequests_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToFreeRequests" ADD CONSTRAINT "_CategoryToFreeRequests_B_fkey" FOREIGN KEY ("B") REFERENCES "FreeRequests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
