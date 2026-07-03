import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TestsService {
  constructor(private prisma: PrismaService) {}

  async getTests(teacherId: string) {
    return (this.prisma as any).cBTTest.findMany({
      where: { teacherId },
      include: { classSubject: { include: { class: true, subject: true } } },
      orderBy: { scheduledDate: 'desc' },
    });
  }

  async createTest(teacherId: string, data: any) {
    const {
      title,
      durationMins,
      instructions,
      scheduledDate,
      classSubjectId,
      questions,
    } = data;

    return (this.prisma as any).cBTTest.create({
      data: {
        title,
        durationMins: Number(durationMins) || 60,
        instructions,
        scheduledDate: new Date(scheduledDate),
        status: 'ACTIVE',
        teacherId,
        classSubjectId,
        questions: {
          create: questions
            ? questions.map((q: any) => ({
                question: q.text,
                points: Number(q.points) || 1,
                options: q.options || [],
              }))
            : [],
        },
      },
    });
  }
}
