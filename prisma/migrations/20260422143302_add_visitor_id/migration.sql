/*
  Warnings:

  - A unique constraint covering the columns `[visitorId,hymnId]` on the table `FavoriteHymn` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[visitorId,verseId]` on the table `FavoriteVerse` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[visitorId,verseId]` on the table `VerseNote` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "FavoriteHymn_hymnId_key";

-- DropIndex
DROP INDEX "FavoriteVerse_verseId_key";

-- DropIndex
DROP INDEX "VerseNote_verseId_key";

-- AlterTable
ALTER TABLE "FavoriteHymn" ADD COLUMN     "visitorId" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "FavoriteVerse" ADD COLUMN     "visitorId" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "VerseNote" ADD COLUMN     "visitorId" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE INDEX "FavoriteHymn_visitorId_idx" ON "FavoriteHymn"("visitorId");

-- CreateIndex
CREATE UNIQUE INDEX "FavoriteHymn_visitorId_hymnId_key" ON "FavoriteHymn"("visitorId", "hymnId");

-- CreateIndex
CREATE INDEX "FavoriteVerse_visitorId_idx" ON "FavoriteVerse"("visitorId");

-- CreateIndex
CREATE UNIQUE INDEX "FavoriteVerse_visitorId_verseId_key" ON "FavoriteVerse"("visitorId", "verseId");

-- CreateIndex
CREATE INDEX "VerseNote_visitorId_idx" ON "VerseNote"("visitorId");

-- CreateIndex
CREATE UNIQUE INDEX "VerseNote_visitorId_verseId_key" ON "VerseNote"("visitorId", "verseId");
