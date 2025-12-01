/*
  Warnings:

  - Added the required column `productCode` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "discountRate" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "company" TEXT,
    "imgUrl" TEXT,
    "productCode" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "state" TEXT NOT NULL DEFAULT 'IN_STOCK',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("categoryId", "company", "createdAt", "description", "discountRate", "id", "imgUrl", "name", "price", "state", "updatedAt") SELECT "categoryId", "company", "createdAt", "description", "discountRate", "id", "imgUrl", "name", "price", "state", "updatedAt" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_productCode_key" ON "Product"("productCode");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
