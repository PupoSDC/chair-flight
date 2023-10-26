/*
  Warnings:

  - You are about to drop the column `url` on the `PageEvent` table. All the data in the column will be lost.
  - Added the required column `path` to the `PageEvent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resolvedPath` to the `PageEvent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `path` to the `TrackEvent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resolvedPath` to the `TrackEvent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PageEvent" DROP COLUMN "url",
ADD COLUMN     "path" TEXT NOT NULL,
ADD COLUMN     "resolvedPath" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TrackEvent" ADD COLUMN     "path" TEXT NOT NULL,
ADD COLUMN     "resolvedPath" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "PageEventDailyCount" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "environment" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "path" TEXT NOT NULL,

    CONSTRAINT "PageEventDailyCount_pkey" PRIMARY KEY ("id")
);
