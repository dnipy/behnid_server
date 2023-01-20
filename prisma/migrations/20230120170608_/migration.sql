-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_id_fkey";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "cityID" INTEGER;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_cityID_fkey" FOREIGN KEY ("cityID") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;
