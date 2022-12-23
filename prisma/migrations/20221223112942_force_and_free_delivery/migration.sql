-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "force" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "freeDelivery" BOOLEAN NOT NULL DEFAULT false;
