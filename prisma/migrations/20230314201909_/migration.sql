-- CreateEnum
CREATE TYPE "SpamType" AS ENUM ('sexual', 'Phishing', 'bot', 'violence');

-- CreateTable
CREATE TABLE "SpamProducts" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productId" INTEGER NOT NULL,
    "spamType" "SpamType" NOT NULL DEFAULT 'violence',

    CONSTRAINT "SpamProducts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpamMessages" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "messageId" INTEGER NOT NULL,
    "spamType" "SpamType" NOT NULL DEFAULT 'violence',

    CONSTRAINT "SpamMessages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpamRequests" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FreeRequestId" INTEGER NOT NULL,
    "spamType" "SpamType" NOT NULL DEFAULT 'violence',

    CONSTRAINT "SpamRequests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpamUsers" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "spamType" "SpamType" NOT NULL DEFAULT 'violence',

    CONSTRAINT "SpamUsers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpamSellers" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sellerId" INTEGER NOT NULL,
    "spamType" "SpamType" NOT NULL DEFAULT 'violence',

    CONSTRAINT "SpamSellers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpamCommentsOnBlog" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "CommentId" INTEGER NOT NULL,
    "spamType" "SpamType" NOT NULL DEFAULT 'violence',

    CONSTRAINT "SpamCommentsOnBlog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpamCommentsOnProducts" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "CommentId" INTEGER NOT NULL,
    "spamType" "SpamType" NOT NULL DEFAULT 'violence',

    CONSTRAINT "SpamCommentsOnProducts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpamCommentsOnSellers" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "CommentId" INTEGER NOT NULL,
    "spamType" "SpamType" NOT NULL DEFAULT 'violence',

    CONSTRAINT "SpamCommentsOnSellers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SpamProducts" ADD CONSTRAINT "SpamProducts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpamMessages" ADD CONSTRAINT "SpamMessages_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpamRequests" ADD CONSTRAINT "SpamRequests_FreeRequestId_fkey" FOREIGN KEY ("FreeRequestId") REFERENCES "FreeRequests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpamUsers" ADD CONSTRAINT "SpamUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpamSellers" ADD CONSTRAINT "SpamSellers_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "sellerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpamCommentsOnBlog" ADD CONSTRAINT "SpamCommentsOnBlog_CommentId_fkey" FOREIGN KEY ("CommentId") REFERENCES "commentsForBlog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpamCommentsOnProducts" ADD CONSTRAINT "SpamCommentsOnProducts_CommentId_fkey" FOREIGN KEY ("CommentId") REFERENCES "commentsForProducts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpamCommentsOnSellers" ADD CONSTRAINT "SpamCommentsOnSellers_CommentId_fkey" FOREIGN KEY ("CommentId") REFERENCES "commentsForSellers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
