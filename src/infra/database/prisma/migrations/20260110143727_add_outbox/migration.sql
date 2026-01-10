-- CreateTable
CREATE TABLE "OutboxMessage" (
    "id" TEXT NOT NULL,
    "aggregateType" TEXT NOT NULL,
    "aggregateId" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "processedAt" TIMESTAMP(3),
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OutboxMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OutboxMessage_processedAt_idx" ON "OutboxMessage"("processedAt");

-- CreateIndex
CREATE INDEX "OutboxMessage_eventName_idx" ON "OutboxMessage"("eventName");

-- CreateIndex
CREATE INDEX "OutboxMessage_aggregateType_aggregateId_idx" ON "OutboxMessage"("aggregateType", "aggregateId");
