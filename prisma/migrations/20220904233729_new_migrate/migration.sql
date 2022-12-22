-- DropForeignKey
ALTER TABLE "Follows" DROP CONSTRAINT "Follows_followerId_fkey";

-- DropForeignKey
ALTER TABLE "Follows" DROP CONSTRAINT "Follows_followingId_fkey";

-- DropForeignKey
ALTER TABLE "FreeRequests" DROP CONSTRAINT "FreeRequests_authorID_fkey";

-- DropForeignKey
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_authorID_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_authorID_fkey";

-- DropForeignKey
ALTER TABLE "RequestOnProducts" DROP CONSTRAINT "RequestOnProducts_AuthorID_fkey";

-- DropForeignKey
ALTER TABLE "RequestOnProducts" DROP CONSTRAINT "RequestOnProducts_productID_fkey";

-- DropForeignKey
ALTER TABLE "commentsForBlog" DROP CONSTRAINT "commentsForBlog_AuthorID_fkey";

-- DropForeignKey
ALTER TABLE "commentsForBlog" DROP CONSTRAINT "commentsForBlog_blogID_fkey";

-- DropForeignKey
ALTER TABLE "commentsForProducts" DROP CONSTRAINT "commentsForProducts_AuthorID_fkey";

-- DropForeignKey
ALTER TABLE "commentsForProducts" DROP CONSTRAINT "commentsForProducts_productID_fkey";

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_authorID_fkey" FOREIGN KEY ("authorID") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commentsForProducts" ADD CONSTRAINT "commentsForProducts_productID_fkey" FOREIGN KEY ("productID") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commentsForProducts" ADD CONSTRAINT "commentsForProducts_AuthorID_fkey" FOREIGN KEY ("AuthorID") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestOnProducts" ADD CONSTRAINT "RequestOnProducts_productID_fkey" FOREIGN KEY ("productID") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestOnProducts" ADD CONSTRAINT "RequestOnProducts_AuthorID_fkey" FOREIGN KEY ("AuthorID") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FreeRequests" ADD CONSTRAINT "FreeRequests_authorID_fkey" FOREIGN KEY ("authorID") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follows" ADD CONSTRAINT "Follows_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follows" ADD CONSTRAINT "Follows_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commentsForBlog" ADD CONSTRAINT "commentsForBlog_blogID_fkey" FOREIGN KEY ("blogID") REFERENCES "Blog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commentsForBlog" ADD CONSTRAINT "commentsForBlog_AuthorID_fkey" FOREIGN KEY ("AuthorID") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_authorID_fkey" FOREIGN KEY ("authorID") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
