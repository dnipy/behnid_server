/*
  Warnings:

  - A unique constraint covering the columns `[FullUrl]` on the table `Images` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `describe` to the `Blog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Blog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Blog" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "describe" TEXT NOT NULL,
ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "title" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "imagesOnBlog" (
    "imageUrl" TEXT NOT NULL,
    "blogID" INTEGER NOT NULL,

    CONSTRAINT "imagesOnBlog_pkey" PRIMARY KEY ("imageUrl","blogID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Images_FullUrl_key" ON "Images"("FullUrl");

-- AddForeignKey
ALTER TABLE "imagesOnBlog" ADD CONSTRAINT "imagesOnBlog_imageUrl_fkey" FOREIGN KEY ("imageUrl") REFERENCES "Images"("FullUrl") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imagesOnBlog" ADD CONSTRAINT "imagesOnBlog_blogID_fkey" FOREIGN KEY ("blogID") REFERENCES "Blog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
