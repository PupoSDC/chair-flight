/*
  Warnings:

  - Added the required column `url` to the `TrackEvent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TrackEvent" ADD COLUMN     "url" TEXT NOT NULL;
