-- CreateTable
CREATE TABLE "keywordForBlog" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "blogID" INTEGER,

    CONSTRAINT "keywordForBlog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "keywordForBlog" ADD CONSTRAINT "keywordForBlog_blogID_fkey" FOREIGN KEY ("blogID") REFERENCES "Blog"("id") ON DELETE CASCADE ON UPDATE CASCADE;
