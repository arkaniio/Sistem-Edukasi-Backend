/*
  Warnings:

  - You are about to drop the column `organizationId` on the `Class` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `Subject` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Announcement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Organization` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ParserJob` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[learningMaterialId]` on the table `Quiz` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "StudyTargetPeriod" AS ENUM ('TODAY', 'TOMORROW', 'THIS_WEEK', 'NEXT_WEEK', 'THIS_MONTH', 'NEXT_MONTH');

-- DropForeignKey
ALTER TABLE "Announcement" DROP CONSTRAINT "Announcement_classSubjectId_fkey";

-- DropForeignKey
ALTER TABLE "Announcement" DROP CONSTRAINT "Announcement_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "ParserJob" DROP CONSTRAINT "ParserJob_createdById_fkey";

-- DropForeignKey
ALTER TABLE "ParserJob" DROP CONSTRAINT "ParserJob_learningMaterialId_fkey";

-- DropForeignKey
ALTER TABLE "ParserJob" DROP CONSTRAINT "ParserJob_questionBankId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_organizationId_fkey";

-- AlterTable
ALTER TABLE "Class" DROP COLUMN "organizationId";

-- AlterTable
ALTER TABLE "LearningMaterial" ADD COLUMN     "fileSize" INTEGER,
ADD COLUMN     "mimeType" TEXT,
ADD COLUMN     "publicId" TEXT;

-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "learningMaterialId" TEXT,
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "shuffleOptions" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "QuizResult" ADD COLUMN     "answerAnalysis" JSONB,
ADD COLUMN     "correctCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "maxScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "totalQuestions" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "unansweredCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "wrongCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "organizationId";

-- AlterTable
ALTER TABLE "Subject" DROP COLUMN "organizationId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "organizationId";

-- DropTable
DROP TABLE "Announcement";

-- DropTable
DROP TABLE "Organization";

-- DropTable
DROP TABLE "ParserJob";

-- DropEnum
DROP TYPE "ParserStatus";

-- CreateTable
CREATE TABLE "StudyTarget" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "period" "StudyTargetPeriod" NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "studentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudyTarget_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Quiz_learningMaterialId_key" ON "Quiz"("learningMaterialId");

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_learningMaterialId_fkey" FOREIGN KEY ("learningMaterialId") REFERENCES "LearningMaterial"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyTarget" ADD CONSTRAINT "StudyTarget_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
