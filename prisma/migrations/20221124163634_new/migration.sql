-- AlterTable
ALTER TABLE "sellerProfile" ALTER COLUMN "sellerStatus" SET DEFAULT 'unAuthorized';

-- CreateTable
CREATE TABLE "follower" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "follower_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "following" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "following_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "follower" ADD CONSTRAINT "follower_name_fkey" FOREIGN KEY ("name") REFERENCES "User"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "following" ADD CONSTRAINT "following_name_fkey" FOREIGN KEY ("name") REFERENCES "User"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
