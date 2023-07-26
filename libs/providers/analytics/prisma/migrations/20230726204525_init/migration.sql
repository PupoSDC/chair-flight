-- CreateTable
CREATE TABLE "PageEvent" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "anonymousId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "referrer" TEXT NOT NULL,
    "height" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "hash" TEXT NOT NULL,
    "timeOnPage" INTEGER NOT NULL,

    CONSTRAINT "PageEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackEvent" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "anonymousId" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "properties" JSONB NOT NULL,

    CONSTRAINT "TrackEvent_pkey" PRIMARY KEY ("id")
);
