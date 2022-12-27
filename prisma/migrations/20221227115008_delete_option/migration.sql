-- AlterTable
ALTER TABLE "FreeRequests" ADD COLUMN     "isShown" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "isShown" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isShown" BOOLEAN NOT NULL DEFAULT true;
