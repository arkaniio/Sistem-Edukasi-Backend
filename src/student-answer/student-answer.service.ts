import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StudentAnswerService {
  constructor(private prisma: PrismaService) {}

  async findByAttempt(attemptId: string) {
    return this.prisma.studentAnswer.findMany({
      where: { attemptId },
      include: { question: true, option: true },
    });
  }
}
