-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('pending', 'rejected', 'accepted');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "productStatus" "ProductStatus" NOT NULL DEFAULT 'pending';
