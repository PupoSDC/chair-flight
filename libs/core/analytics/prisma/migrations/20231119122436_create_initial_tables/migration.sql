-- CreateTable
CREATE TABLE "PageEvent" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "anonymousId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "referrer" TEXT NOT NULL,
    "height" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "environment" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "resolvedPath" TEXT NOT NULL,

    CONSTRAINT "PageEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PageEventDailyCount" (
    "id" TEXT NOT NULL,
    "environment" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "path" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PageEventDailyCount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackEvent" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "anonymousId" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "properties" JSONB NOT NULL,
    "environment" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "resolvedPath" TEXT NOT NULL,

    CONSTRAINT "TrackEvent_pkey" PRIMARY KEY ("id")
);
