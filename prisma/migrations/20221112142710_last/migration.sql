-- CreateEnum
CREATE TYPE "sellerType" AS ENUM ('person', 'company');

-- AlterTable
ALTER TABLE "sellerProfile" ADD COLUMN     "company_1" TEXT,
ADD COLUMN     "company_2" TEXT,
ADD COLUMN     "company_3" TEXT,
ADD COLUMN     "company_4" TEXT,
ADD COLUMN     "person_1" TEXT,
ADD COLUMN     "person_2" TEXT,
ADD COLUMN     "person_3" TEXT,
ADD COLUMN     "person_4" TEXT,
ADD COLUMN     "sellerType" "sellerType" NOT NULL DEFAULT 'person';
