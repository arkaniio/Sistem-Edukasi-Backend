import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QuestionService {
  constructor(private prisma: PrismaService) {}

  async findAll(params?: { questionBankId?: string; type?: string }) {
    const where: any = {};
    if (params?.questionBankId) where.questionBankId = params.questionBankId;
    if (params?.type) where.type = params.type;
    return this.prisma.question.findMany({
      where,
      include: {
        options: { orderBy: { label: 'asc' } },
        questionBank: { select: { id: true, title: true } },
      },
      orderBy: { order: 'asc' },
    });
  }

  async findById(id: string) {
    const question = await this.prisma.question.findUnique({
      where: { id },
      include: {
        options: { orderBy: { label: 'asc' } },
        questionBank: { select: { id: true, title: true } },
      },
    });
    if (!question) throw new NotFoundException('Question not found');
    return question;
  }

  async update(id: string, dto: any) {
    await this.findById(id);
    if (dto.options) {
      await this.prisma.option.deleteMany({ where: { questionId: id } });
      await this.prisma.question.update({
        where: { id },
        data: {
          question: dto.question,
          explanation: dto.explanation,
          score: dto.score,
          tags: dto.tags,
          imageUrl: dto.imageUrl,
          options: {
            create: dto.options.map((opt: any, i: number) => ({
              label: opt.label || String.fromCharCode(65 + i),
              text: opt.text,
              isCorrect: opt.isCorrect || false,
            })),
          },
        },
        include: { options: true },
      });
    }
    return this.prisma.question.update({
      where: { id },
      data: {
        question: dto.question,
        explanation: dto.explanation,
        score: dto.score,
        tags: dto.tags,
        imageUrl: dto.imageUrl,
      },
      include: { options: true },
    });
  }

  async delete(id: string) {
    await this.findById(id);
    await this.prisma.option.deleteMany({ where: { questionId: id } });
    await this.prisma.question.delete({ where: { id } });
    return { message: 'Question deleted' };
  }
}
