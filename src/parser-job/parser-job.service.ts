import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ParserStatus, QuestionType } from '@prisma/client';
import * as crypto from 'crypto';

@Injectable()
export class ParserJobService {
  private readonly logger = new Logger(ParserJobService.name);

  constructor(private prisma: PrismaService) {}

  async findAll(status?: ParserStatus, userId?: string) {
    const where: any = {};
    if (status) where.status = status;
    if (userId) where.createdById = userId;

    const jobs = await this.prisma.parserJob.findMany({
      where,
      include: {
        learningMaterial: {
          select: { id: true, title: true, fileUrl: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return jobs.map((job) => this.mapToDto(job));
  }

  async findById(id: string, userId?: string) {
    const where: any = { id };
    if (userId) where.createdById = userId;

    const job = await this.prisma.parserJob.findFirst({
      where,
      include: {
        learningMaterial: {
          select: { id: true, title: true, fileUrl: true },
        },
      },
    });

    if (!job) throw new NotFoundException('Parser job not found');
    return this.mapToDto(job);
  }

  async create(learningMaterialId: string, createdById: string) {
    const job = await this.prisma.parserJob.create({
      data: {
        status: ParserStatus.PENDING,
        learningMaterialId,
        createdById,
      },
      include: {
        learningMaterial: {
          select: { id: true, title: true, fileUrl: true },
        },
      },
    });

    // Start parsing in the background asynchronously
    this.startParsing(job.id).catch((err) => {
      this.logger.error(`Background parsing failed: ${err.message}`, err.stack);
    });

    return this.mapToDto(job);
  }

  async retry(id: string, userId?: string) {
    const where: any = { id };
    if (userId) where.createdById = userId;

    const job = await this.prisma.parserJob.findFirst({
      where,
      include: {
        learningMaterial: {
          select: { id: true, title: true, fileUrl: true },
        },
      },
    });

    if (!job) throw new NotFoundException('Parser job not found');

    const updatedJob = await this.prisma.parserJob.update({
      where: { id },
      data: {
        status: ParserStatus.PENDING,
        error: null,
        retryCount: job.retryCount + 1,
      },
      include: {
        learningMaterial: {
          select: { id: true, title: true, fileUrl: true },
        },
      },
    });

    // Start parsing in the background asynchronously
    this.startParsing(updatedJob.id).catch((err) => {
      this.logger.error(`Background parsing failed: ${err.message}`, err.stack);
    });

    return this.mapToDto(updatedJob);
  }

  async startParsing(id: string) {
    const job = await this.prisma.parserJob.findUnique({
      where: { id },
      include: {
        learningMaterial: {
          include: {
            classSubject: true,
          },
        },
      },
    });

    if (!job) return;

    try {
      // Update status to PROCESSING
      await this.prisma.parserJob.update({
        where: { id },
        data: { status: ParserStatus.PROCESSING },
      });

      // Call Python parser service
      const parserUrl = process.env.PARSER_SERVICE_URL || 'http://localhost:8000/parse-pdf';
      this.logger.log(`Sending parse request to: ${parserUrl} | PDF: ${job.learningMaterial.fileUrl}`);

      const response = await fetch(parserUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pdfUrl: job.learningMaterial.fileUrl }),
      });

      if (!response.ok) {
        throw new Error(`Parser service responded with status ${response.status}`);
      }

      const result: any = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Unknown parser error');
      }

      const resultData = result.data;
      const parsedQuestions = resultData.questions || [];

      // Create new Question Bank
      const title = resultData.title || job.learningMaterial.title || 'Parsed Question Bank';
      const questionBank = await this.prisma.questionBank.create({
        data: {
          title,
          description: resultData.description || `Parsed from PDF: ${job.learningMaterial.title}`,
          createdById: job.createdById,
          isDraft: true,
          subjectId: job.learningMaterial.classSubject?.subjectId || null,
        },
      });

      // Deduplicate and save questions
      const seenHashes = new Set<string>();
      let order = 1;

      for (const q of parsedQuestions) {
        const mappedType = this.mapQuestionType(q.type);
        const optionsList = q.options || [];

        // Format options correctly for hashing
        let formattedOptions = optionsList.map((opt: any, index: number) => ({
          label: opt.label || String.fromCharCode(65 + index),
          text: opt.text || '',
          isCorrect: !!opt.isCorrect,
        }));

        if (mappedType === QuestionType.ESSAY && q.answer) {
          formattedOptions.push({
            label: 'Kunci',
            text: q.answer,
            isCorrect: true,
          });
        }

        const contentToHash = JSON.stringify({
          question: q.question,
          options: formattedOptions,
          type: mappedType,
        });

        const hash = crypto
          .createHash('sha256')
          .update(contentToHash)
          .digest('hex');

        if (seenHashes.has(hash)) {
          this.logger.warn(`Skipping duplicate question hash in bank: ${hash}`);
          continue;
        }
        seenHashes.add(hash);

        await this.prisma.question.create({
          data: {
            question: q.question,
            type: mappedType,
            explanation: q.explanation || null,
            score: q.score || 1,
            tags: q.tags || [],
            order: order++,
            hash,
            questionBankId: questionBank.id,
            options: formattedOptions.length > 0 ? {
              create: formattedOptions,
            } : undefined,
          },
        });
      }

      // Update parser job on SUCCESS
      await this.prisma.parserJob.update({
        where: { id },
        data: {
          status: ParserStatus.SUCCESS,
          questionBankId: questionBank.id,
          result: resultData,
        },
      });

      this.logger.log(`Parser job ${id} completed successfully. Created bank: ${questionBank.id}`);
    } catch (err: any) {
      this.logger.error(`Error processing parser job ${id}: ${err.message}`, err.stack);
      
      // Update parser job on FAILED
      await this.prisma.parserJob.update({
        where: { id },
        data: {
          status: ParserStatus.FAILED,
          error: err.message || 'Unknown processing error',
        },
      });
    }
  }

  private mapQuestionType(pyType: string): QuestionType {
    const typeMap: Record<string, QuestionType> = {
      MULTIPLE_CHOICE: QuestionType.MCQ,
      MULTIPLE_SELECT: QuestionType.MULTI_SELECT,
      TRUE_FALSE: QuestionType.TRUE_FALSE,
      ESSAY: QuestionType.ESSAY,
      BENAR_SALAH_KOMPLEKS: QuestionType.MULTI_SELECT,
    };
    return typeMap[pyType] || QuestionType.MCQ;
  }

  private mapToDto(job: any) {
    return {
      id: job.id,
      status: job.status,
      errorMessage: job.error,
      warningMessage: null,
      rawResult: job.result,
      normalizedResult: job.result,
      validationErrors: null,
      retryCount: job.retryCount,
      processedAt: job.updatedAt,
      learningMaterial: job.learningMaterial ? {
        id: job.learningMaterial.id,
        title: job.learningMaterial.title,
        fileUrl: job.learningMaterial.fileUrl,
      } : null,
      questionBankId: job.questionBankId,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    };
  }
}
