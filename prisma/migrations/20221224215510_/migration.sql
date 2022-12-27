-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_cityID_cityName_fkey";

-- DropIndex
DROP INDEX "City_id_name_key";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_cityName_fkey" FOREIGN KEY ("cityName") REFERENCES "City"("name") ON DELETE SET NULL ON UPDATE CASCADE;
