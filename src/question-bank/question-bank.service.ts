import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class QuestionBankService {
  constructor(private prisma: PrismaService) {}

  async findAll(params?: {
    isDraft?: boolean;
    subjectId?: string;
    search?: string;
  }) {
    const where: any = {};
    if (params?.isDraft !== undefined) where.isDraft = params.isDraft;
    if (params?.subjectId) where.subjectId = params.subjectId;
    if (params?.search) {
      where.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } },
      ];
    }
    return this.prisma.questionBank.findMany({
      where,
      include: {
        _count: { select: { questions: true } },
        subject: true,
        createdBy: { select: { id: true, firstName: true, lastName: true } },
        parserJobs: {
          include: {
            learningMaterial: {
              select: {
                id: true,
                title: true,
                fileUrl: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    const bank = await this.prisma.questionBank.findUnique({
      where: { id },
      include: {
        questions: {
          include: { options: { orderBy: { label: 'asc' } } },
          orderBy: { order: 'asc' },
        },
        subject: true,
        createdBy: { select: { id: true, firstName: true, lastName: true } },
        parserJobs: {
          include: {
            learningMaterial: {
              select: {
                id: true,
                title: true,
                fileUrl: true,
              },
            },
          },
        },
      },
    });
    if (!bank) throw new NotFoundException('Question bank not found');
    return bank;
  }

  async create(userId: string, dto: any) {
    return this.prisma.questionBank.create({
      data: {
        title: dto.title,
        description: dto.description,
        difficulty: dto.difficulty,
        subjectId: dto.subjectId,
        createdById: userId,
        isDraft: true,
      },
    });
  }

  async update(id: string, dto: any) {
    await this.findById(id);
    return this.prisma.questionBank.update({ where: { id }, data: dto });
  }

  async publish(id: string) {
    await this.findById(id);
    return this.prisma.questionBank.update({
      where: { id },
      data: { isDraft: false },
    });
  }

  async delete(id: string) {
    await this.findById(id);

    // 1. Delete all options belonging to questions in this bank
    await this.prisma.option.deleteMany({
      where: { question: { questionBankId: id } },
    });

    // 2. Delete all questions in this bank
    await this.prisma.question.deleteMany({
      where: { questionBankId: id },
    });

    // 4. Now safely delete the question bank
    await this.prisma.questionBank.delete({ where: { id } });
    return { message: 'Question bank deleted' };
  }

  async addQuestion(bankId: string, dto: any) {
    await this.findById(bankId);

    const contentToHash = JSON.stringify({
      question: dto.question,
      options: dto.options,
      type: dto.type,
    });

    const hash = crypto
      .createHash('sha256')
      .update(contentToHash)
      .digest('hex');

    const existing = await this.prisma.question.findUnique({
      where: {
        hash_questionBankId: {
          hash,
          questionBankId: bankId,
        },
      },
    });

    if (existing) {
      throw new ConflictException(
        'Duplicate question: same question already exists in this bank',
      );
    }

    // Cari soal terakhir
    const lastQuestion = await this.prisma.question.findFirst({
      where: {
        questionBankId: bankId,
      },
      orderBy: {
        order: 'desc',
      },
    });

    const nextOrder = (lastQuestion?.order ?? 0) + 1;

    return this.prisma.question.create({
      data: {
        question: dto.question,
        type: dto.type || 'MCQ',
        explanation: dto.explanation,
        score: dto.score || 1,
        tags: dto.tags || [],
        imageUrl: dto.imageUrl,
        order: nextOrder,
        hash,
        questionBankId: bankId,
        options: dto.options
          ? {
              create: dto.options.map((opt: any, i: number) => ({
                label: opt.label || String.fromCharCode(65 + i),
                text: opt.text,
                isCorrect: !!opt.isCorrect,
              })),
            }
          : undefined,
      },
      include: {
        options: true,
      },
    });
  }
}
