-- AlterTable
ALTER TABLE "Blog" ADD COLUMN     "imgsrc" TEXT;

-- AlterTable
ALTER TABLE "FreeRequests" ADD COLUMN     "imgsrc" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "imgsrc" TEXT;

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "instaAcc" TEXT,
ADD COLUMN     "profilePic" TEXT,
ADD COLUMN     "workNumber" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar" TEXT;
