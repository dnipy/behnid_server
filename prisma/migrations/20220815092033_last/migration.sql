/*
  Warnings:

  - The primary key for the `ImagesOnProducts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `imageID` on the `ImagesOnProducts` table. All the data in the column will be lost.
  - The primary key for the `imagesOnBlog` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `imageUrl` on the `imagesOnBlog` table. All the data in the column will be lost.
  - You are about to drop the `Images` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[FullUrl]` on the table `ImagesOnProducts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[FullUrl]` on the table `imagesOnBlog` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `FullUrl` to the `ImagesOnProducts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `ImagesOnProducts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `ImagesOnProducts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `FullUrl` to the `imagesOnBlog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `imagesOnBlog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `imagesOnBlog` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ImagesOnProducts" DROP CONSTRAINT "ImagesOnProducts_imageID_fkey";

-- DropForeignKey
ALTER TABLE "imagesOnBlog" DROP CONSTRAINT "imagesOnBlog_imageUrl_fkey";

-- AlterTable
ALTER TABLE "ImagesOnProducts" DROP CONSTRAINT "ImagesOnProducts_pkey",
DROP COLUMN "imageID",
ADD COLUMN     "FullUrl" TEXT NOT NULL,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL,
ADD CONSTRAINT "ImagesOnProducts_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "catID" DROP NOT NULL;

-- AlterTable
ALTER TABLE "commentsForBlog" ADD COLUMN     "message" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "commentsForProducts" ADD COLUMN     "message" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "imagesOnBlog" DROP CONSTRAINT "imagesOnBlog_pkey",
DROP COLUMN "imageUrl",
ADD COLUMN     "FullUrl" TEXT NOT NULL,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL,
ADD CONSTRAINT "imagesOnBlog_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "Images";

-- CreateIndex
CREATE UNIQUE INDEX "ImagesOnProducts_FullUrl_key" ON "ImagesOnProducts"("FullUrl");

-- CreateIndex
CREATE UNIQUE INDEX "imagesOnBlog_FullUrl_key" ON "imagesOnBlog"("FullUrl");
