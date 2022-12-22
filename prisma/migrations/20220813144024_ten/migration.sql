/*
  Warnings:

  - You are about to drop the `CommentsOnProducts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CommentsOnProducts" DROP CONSTRAINT "CommentsOnProducts_productID_fkey";

-- DropForeignKey
ALTER TABLE "CommentsOnProducts" DROP CONSTRAINT "CommentsOnProducts_userID_fkey";

-- DropTable
DROP TABLE "CommentsOnProducts";

-- CreateTable
CREATE TABLE "commentsForProducts" (
    "id" SERIAL NOT NULL,
    "productID" INTEGER,

    CONSTRAINT "commentsForProducts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubCat" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "CatID" INTEGER,

    CONSTRAINT "SubCat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commentsForBlog" (
    "id" SERIAL NOT NULL,
    "blogID" INTEGER,

    CONSTRAINT "commentsForBlog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "commentsForProducts" ADD CONSTRAINT "commentsForProducts_productID_fkey" FOREIGN KEY ("productID") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubCat" ADD CONSTRAINT "SubCat_CatID_fkey" FOREIGN KEY ("CatID") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commentsForBlog" ADD CONSTRAINT "commentsForBlog_blogID_fkey" FOREIGN KEY ("blogID") REFERENCES "Blog"("id") ON DELETE SET NULL ON UPDATE CASCADE;
