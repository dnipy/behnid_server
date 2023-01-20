/*
  Warnings:

  - Made the column `unitID` on table `FreeRequests` required. This step will fail if there are existing NULL values in that column.
  - Made the column `unitName` on table `FreeRequests` required. This step will fail if there are existing NULL values in that column.
  - Made the column `unitID` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `unitName` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "FreeRequests" ALTER COLUMN "unitID" SET NOT NULL,
ALTER COLUMN "unitID" SET DEFAULT 1,
ALTER COLUMN "unitName" SET NOT NULL,
ALTER COLUMN "unitName" SET DEFAULT 'کیلوگرم';

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "unitID" SET NOT NULL,
ALTER COLUMN "unitID" SET DEFAULT 1,
ALTER COLUMN "unitName" SET NOT NULL,
ALTER COLUMN "unitName" SET DEFAULT 'کیلوگرم';
