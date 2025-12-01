/*
  Warnings:

  - You are about to drop the column `color` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `Product` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "ProductOption" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" INTEGER NOT NULL,
    "size" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "ProductOption_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

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
    "category" TEXT NOT NULL,
    "state" TEXT NOT NULL DEFAULT 'IN_STOCK',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Product" ("category", "company", "createdAt", "description", "discountRate", "id", "imgUrl", "name", "price", "state", "updatedAt") SELECT "category", "company", "createdAt", "description", "discountRate", "id", "imgUrl", "name", "price", "state", "updatedAt" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "ProductOption_productId_size_color_key" ON "ProductOption"("productId", "size", "color");
