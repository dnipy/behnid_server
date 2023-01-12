-- CreateTable
CREATE TABLE "CategoryForBlog" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "BlogID" INTEGER NOT NULL,

    CONSTRAINT "CategoryForBlog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CategoryForBlog_name_key" ON "CategoryForBlog"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CategoryForBlog_id_name_key" ON "CategoryForBlog"("id", "name");

-- AddForeignKey
ALTER TABLE "CategoryForBlog" ADD CONSTRAINT "CategoryForBlog_BlogID_fkey" FOREIGN KEY ("BlogID") REFERENCES "Blog"("id") ON DELETE CASCADE ON UPDATE CASCADE;
