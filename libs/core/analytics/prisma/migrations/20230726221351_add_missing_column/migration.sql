/*
  Warnings:

  - Added the required column `environment` to the `PageEvent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `environment` to the `TrackEvent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PageEvent" ADD COLUMN     "environment" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TrackEvent" ADD COLUMN     "environment" TEXT NOT NULL;
