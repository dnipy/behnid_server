-- AlterTable
ALTER TABLE "FreeRequests" ADD COLUMN     "unitID" INTEGER,
ADD COLUMN     "unitName" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "unitID" INTEGER,
ADD COLUMN     "unitName" TEXT;

-- CreateTable
CREATE TABLE "Unit" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Unit_name_key" ON "Unit"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Unit_id_name_key" ON "Unit"("id", "name");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_unitID_unitName_fkey" FOREIGN KEY ("unitID", "unitName") REFERENCES "Unit"("id", "name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FreeRequests" ADD CONSTRAINT "FreeRequests_unitID_unitName_fkey" FOREIGN KEY ("unitID", "unitName") REFERENCES "Unit"("id", "name") ON DELETE CASCADE ON UPDATE CASCADE;
