/*
  Warnings:

  - You are about to drop the column `image` on the `Pokemons` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Pokemons" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "trainer" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Pokemons" ("createdAt", "id", "level", "name", "trainer", "type", "updatedAt") SELECT "createdAt", "id", "level", "name", "trainer", "type", "updatedAt" FROM "Pokemons";
DROP TABLE "Pokemons";
ALTER TABLE "new_Pokemons" RENAME TO "Pokemons";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
