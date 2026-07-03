import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ResultService {
  constructor(private prisma: PrismaService) {}

  async getQuizResults(quizId: string) {
    const quiz = await this.prisma.quiz.findUnique({ where: { id: quizId } });
    if (!quiz) throw new NotFoundException('Quiz not found');

    const attempts = await this.prisma.quizAttempt.findMany({
      where: { quizId, status: 'COMPLETED' },
      include: {
        student: {
          select: { id: true, firstName: true, lastName: true, nisn: true },
        },
        quizResult: true,
      },
      orderBy: { percentage: 'desc' },
    });

    const totalAttempts = await this.prisma.quizAttempt.count({
      where: { quizId },
    });
    const avgPercentage =
      attempts.length > 0
        ? Math.round(
            attempts.reduce((sum, a) => sum + (a.percentage || 0), 0) /
              attempts.length,
          )
        : 0;
    const passRate =
      attempts.length > 0
        ? Math.round(
            (attempts.filter((a) => a.isPassed).length / attempts.length) * 100,
          )
        : 0;
    const totalStudents = new Set(attempts.map((a) => a.userId)).size;

    return {
      quiz: { id: quiz.id, title: quiz.title },
      stats: {
        totalAttempts,
        completedAttempts: attempts.length,
        averagePercentage: avgPercentage,
        averageScore: avgPercentage,
        passRate,
        totalStudents,
      },
      attempts,
    };
  }

  async getStudentResults(userId: string) {
    const attempts = await this.prisma.quizAttempt.findMany({
      where: { userId, status: 'COMPLETED' },
      include: {
        quiz: {
          select: { id: true, title: true, subject: true, passingScore: true },
        },
        quizResult: true,
      },
      orderBy: { completedAt: 'desc' },
    });

    return { results: attempts };
  }

  async getGradeReport(userId: string) {
    const attempts = await this.prisma.quizAttempt.findMany({
      where: { userId, status: 'COMPLETED' },
      include: {
        quiz: { select: { id: true, title: true, subject: true } },
        quizResult: true,
      },
      orderBy: { completedAt: 'desc' },
    });

    const totalQuizzes = attempts.length;
    const passed = attempts.filter((a) => a.isPassed).length;
    const avgScore =
      totalQuizzes > 0
        ? Math.round(
            attempts.reduce((sum, a) => sum + (a.percentage || 0), 0) /
              totalQuizzes,
          )
        : 0;
    const totalScore = attempts.reduce((sum, a) => sum + (a.score || 0), 0);

    const bySubject: Record<
      string,
      { count: number; totalPercentage: number }
    > = {};
    for (const a of attempts) {
      const subjectName = a.quiz.subject?.name || 'General';
      if (!bySubject[subjectName])
        bySubject[subjectName] = { count: 0, totalPercentage: 0 };
      bySubject[subjectName].count++;
      bySubject[subjectName].totalPercentage += a.percentage || 0;
    }

    const subjectBreakdown = Object.entries(bySubject).map(([name, data]) => ({
      subject: name,
      attempts: data.count,
      averagePercentage: Math.round(data.totalPercentage / data.count),
    }));

    return {
      summary: {
        totalQuizzes,
        passed,
        failed: totalQuizzes - passed,
        avgScore,
        totalScore,
      },
      subjectBreakdown,
      recentAttempts: attempts.slice(0, 10),
      results: attempts,
    };
  }
}
