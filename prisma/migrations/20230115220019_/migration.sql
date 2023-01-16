/*
  Warnings:

  - You are about to drop the `retesForSellers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "retesForSellers" DROP CONSTRAINT "retesForSellers_AuthorID_fkey";

-- DropForeignKey
ALTER TABLE "retesForSellers" DROP CONSTRAINT "retesForSellers_sellerID_fkey";

-- DropTable
DROP TABLE "retesForSellers";

-- CreateTable
CREATE TABLE "ratesForSellers" (
    "id" SERIAL NOT NULL,
    "AuthorID" INTEGER NOT NULL,
    "rates" "Rates" NOT NULL DEFAULT 'unset',
    "sellerID" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ratesForSellers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ratesForSellers_AuthorID_key" ON "ratesForSellers"("AuthorID");

-- AddForeignKey
ALTER TABLE "ratesForSellers" ADD CONSTRAINT "ratesForSellers_AuthorID_fkey" FOREIGN KEY ("AuthorID") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ratesForSellers" ADD CONSTRAINT "ratesForSellers_sellerID_fkey" FOREIGN KEY ("sellerID") REFERENCES "sellerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
