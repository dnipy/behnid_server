-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_cityName_fkey";

-- DropIndex
DROP INDEX "City_name_key";

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_id_fkey" FOREIGN KEY ("id") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;
