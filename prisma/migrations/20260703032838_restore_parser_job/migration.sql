-- CreateEnum
CREATE TYPE "ParserStatus" AS ENUM ('PENDING', 'PROCESSING', 'SUCCESS', 'FAILED');

-- CreateTable
CREATE TABLE "ParserJob" (
    "id" TEXT NOT NULL,
    "status" "ParserStatus" NOT NULL DEFAULT 'PENDING',
    "error" TEXT,
    "result" JSONB,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "learningMaterialId" TEXT NOT NULL,
    "questionBankId" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ParserJob_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ParserJob_learningMaterialId_key" ON "ParserJob"("learningMaterialId");

-- CreateIndex
CREATE INDEX "ParserJob_status_idx" ON "ParserJob"("status");

-- CreateIndex
CREATE INDEX "ParserJob_learningMaterialId_idx" ON "ParserJob"("learningMaterialId");

-- CreateIndex
CREATE INDEX "ParserJob_questionBankId_idx" ON "ParserJob"("questionBankId");

-- CreateIndex
CREATE INDEX "ParserJob_createdById_idx" ON "ParserJob"("createdById");

-- AddForeignKey
ALTER TABLE "ParserJob" ADD CONSTRAINT "ParserJob_learningMaterialId_fkey" FOREIGN KEY ("learningMaterialId") REFERENCES "LearningMaterial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParserJob" ADD CONSTRAINT "ParserJob_questionBankId_fkey" FOREIGN KEY ("questionBankId") REFERENCES "QuestionBank"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParserJob" ADD CONSTRAINT "ParserJob_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
