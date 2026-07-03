import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QuizService {
  constructor(private prisma: PrismaService) {}

  async findAll(params?: {
    status?: string;
    subjectId?: string;
    search?: string;
  }) {
    const where: any = {};
    if (params?.status) where.status = params.status;
    if (params?.subjectId) where.subjectId = params.subjectId;
    if (params?.search) {
      where.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } },
      ];
    }
    return this.prisma.quiz.findMany({
      where,
      include: {
        _count: { select: { quizQuestions: true, quizAttempts: true } },
        subject: true,
        createdBy: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findForStudent(userId: string) {
    const student = await this.prisma.student.findUnique({ where: { userId } });
    if (!student) return [];

    return this.prisma.quiz.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        _count: { select: { quizQuestions: true } },
        subject: true,
        quizAttempts: {
          where: { userId },
          select: {
            id: true,
            status: true,
            score: true,
            percentage: true,
            attemptNumber: true,
            completedAt: true,
          },
          orderBy: { attemptNumber: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      include: {
        subject: true,
        createdBy: { select: { id: true, firstName: true, lastName: true } },
        quizQuestions: {
          include: {
            question: { include: { options: { orderBy: { label: 'asc' } } } },
          },
          orderBy: { order: 'asc' },
        },
        _count: { select: { quizAttempts: true } },
      },
    });
    if (!quiz) throw new NotFoundException('Quiz not found');
    return quiz;
  }

  async create(userId: string, dto: any) {
    return this.prisma.quiz.create({
      data: {
        title: dto.title,
        description: dto.description,
        difficulty: dto.difficulty || 'MEDIUM',
        timeLimit: dto.timeLimit,
        passingScore: dto.passingScore || 0,
        subjectId: dto.subjectId,
        createdById: userId,
        shuffleQuestions: dto.shuffleQuestions || false,
        showResults: dto.showResults !== false,
        maxAttempts: dto.maxAttempts || 1,
      },
    });
  }

  async update(id: string, dto: any) {
    await this.findById(id);
    return this.prisma.quiz.update({ where: { id }, data: dto });
  }

  async publish(id: string) {
    const quiz = await this.findById(id);
    if (quiz.quizQuestions.length === 0)
      throw new BadRequestException('Cannot publish quiz with no questions');
    return this.prisma.quiz.update({
      where: { id },
      data: { status: 'PUBLISHED' },
    });
  }

  async close(id: string) {
    await this.findById(id);
    return this.prisma.quiz.update({
      where: { id },
      data: { status: 'CLOSED' },
    });
  }

  async addQuestions(quizId: string, questionIds: string[]) {
    const quiz = await this.findById(quizId);
    if (quiz.status !== 'DRAFT')
      throw new BadRequestException('Can only add questions to draft quizzes');

    const existingCount = await this.prisma.quizQuestion.count({
      where: { quizId },
    });

    const data = questionIds.map((questionId, i) => ({
      quizId,
      questionId,
      order: existingCount + i + 1,
    }));

    await this.prisma.quizQuestion.createMany({ data });
    return this.findById(quizId);
  }

  async removeQuestion(quizId: string, questionId: string) {
    await this.prisma.quizQuestion.deleteMany({
      where: { quizId, questionId },
    });
    return this.findById(quizId);
  }

  async delete(id: string) {
    await this.findById(id);

    // Find all question banks linked to this quiz's questions
    const quizQuestions = await this.prisma.quizQuestion.findMany({
      where: { quizId: id },
      include: { question: { select: { questionBankId: true } } },
    });

    const bankIds = [
      ...new Set(quizQuestions.map((qq) => qq.question.questionBankId)),
    ].filter(Boolean);

    // Delete quiz questions then the quiz itself
    await this.prisma.quizQuestion.deleteMany({ where: { quizId: id } });
    await this.prisma.quiz.delete({ where: { id } });

    // Reset associated question banks back to draft so they can be re-published
    if (bankIds.length > 0) {
      await this.prisma.questionBank.updateMany({
        where: { id: { in: bankIds } },
        data: { isDraft: true },
      });
    }

    return { message: 'Quiz deleted' };
  }
}
