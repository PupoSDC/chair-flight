-- AlterTable
ALTER TABLE "PageEventDailyCount" ALTER COLUMN "timestamp" DROP DEFAULT,
ALTER COLUMN "timestamp" SET DATA TYPE TEXT;
