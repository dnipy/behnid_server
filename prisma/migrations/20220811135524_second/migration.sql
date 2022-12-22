-- CreateEnum
CREATE TYPE "userRole" AS ENUM ('Buyer', 'Seller');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT,
    "phone" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "Role" "userRole" NOT NULL DEFAULT 'Buyer',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "provienceID" INTEGER NOT NULL DEFAULT 0,
    "followers" INTEGER NOT NULL DEFAULT 0,
    "following" INTEGER NOT NULL DEFAULT 0,
    "name" TEXT,
    "family" TEXT,
    "address" TEXT,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommentsOnProducts" (
    "userID" INTEGER NOT NULL,
    "productID" INTEGER NOT NULL,
    "commentBody" TEXT NOT NULL,

    CONSTRAINT "CommentsOnProducts_pkey" PRIMARY KEY ("userID","productID")
);

-- CreateTable
CREATE TABLE "ImagesOnProducts" (
    "productID" INTEGER NOT NULL,
    "imageID" INTEGER NOT NULL,

    CONSTRAINT "ImagesOnProducts_pkey" PRIMARY KEY ("productID","imageID")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "image" TEXT,
    "title" TEXT NOT NULL,
    "describe" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "addDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sendArea" TEXT,
    "packType" TEXT NOT NULL,
    "minOrder" INTEGER NOT NULL,
    "customerPrice" INTEGER NOT NULL,
    "producerPrice" INTEGER NOT NULL,
    "weight" TEXT NOT NULL,
    "deliveryTime" TEXT NOT NULL,
    "authorID" INTEGER NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categorie" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Categorie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoriesOnProducts" (
    "productID" INTEGER NOT NULL,
    "categorisID" INTEGER NOT NULL,

    CONSTRAINT "CategoriesOnProducts_pkey" PRIMARY KEY ("categorisID","productID")
);

-- CreateTable
CREATE TABLE "Connection" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Connection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Request" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Blog" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Blog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Images" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "FullUrl" TEXT NOT NULL,

    CONSTRAINT "Images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userID_key" ON "Profile"("userID");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentsOnProducts" ADD CONSTRAINT "CommentsOnProducts_productID_fkey" FOREIGN KEY ("productID") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentsOnProducts" ADD CONSTRAINT "CommentsOnProducts_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImagesOnProducts" ADD CONSTRAINT "ImagesOnProducts_productID_fkey" FOREIGN KEY ("productID") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImagesOnProducts" ADD CONSTRAINT "ImagesOnProducts_imageID_fkey" FOREIGN KEY ("imageID") REFERENCES "Images"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_authorID_fkey" FOREIGN KEY ("authorID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoriesOnProducts" ADD CONSTRAINT "CategoriesOnProducts_productID_fkey" FOREIGN KEY ("productID") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoriesOnProducts" ADD CONSTRAINT "CategoriesOnProducts_categorisID_fkey" FOREIGN KEY ("categorisID") REFERENCES "Categorie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
