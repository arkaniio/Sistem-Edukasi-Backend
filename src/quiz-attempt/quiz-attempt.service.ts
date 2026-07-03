import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QuizAttemptService {
  constructor(private prisma: PrismaService) {}

  async startAttempt(userId: string, quizId: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        quizQuestions: {
          include: {
            question: { include: { options: { orderBy: { label: 'asc' } } } },
          },
          orderBy: { order: 'asc' },
        },
      },
    });
    if (!quiz) throw new NotFoundException('Quiz not found');
    if (quiz.status !== 'PUBLISHED')
      throw new BadRequestException('Quiz is not published');

    const student = await this.prisma.student.findUnique({ where: { userId } });
    if (!student) throw new BadRequestException('Student profile not found');

    const existingAttempts = await this.prisma.quizAttempt.count({
      where: { quizId, userId },
    });
    if (quiz.maxAttempts > 1 && existingAttempts >= quiz.maxAttempts) {
      throw new BadRequestException('Maximum attempts reached');
    }

    // Return existing in-progress attempt
    const inProgress = await this.prisma.quizAttempt.findFirst({
      where: { quizId, userId, status: 'IN_PROGRESS' },
      include: {
        quiz: {
          include: {
            quizQuestions: {
              include: {
                question: {
                  include: { options: { orderBy: { label: 'asc' } } },
                },
              },
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });
    if (inProgress) return inProgress;

    return this.prisma.quizAttempt.create({
      data: {
        quizId,
        userId,
        studentId: student.id,
        totalQuestions: quiz.quizQuestions.length,
        attemptNumber: existingAttempts + 1,
      },
      include: {
        quiz: {
          include: {
            quizQuestions: {
              include: {
                question: {
                  include: {
                    options: { orderBy: { label: 'asc' } },
                  },
                },
              },
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });
  }

  async submitAttempt(
    userId: string,
    attemptId: string,
    answers: {
      questionId: string;
      optionId?: string;
      essayAnswer?: string;
    }[],
  ) {
    const attempt = await this.prisma.quizAttempt.findUnique({
      where: { id: attemptId },
      include: {
        quiz: {
          include: {
            quizQuestions: {
              include: { question: { include: { options: true } } },
            },
          },
        },
      },
    });
    if (!attempt) throw new NotFoundException('Attempt not found');
    if (attempt.userId !== userId)
      throw new ForbiddenException('Not your attempt');
    if (attempt.status !== 'IN_PROGRESS')
      throw new BadRequestException('Attempt already completed');

    let correctCount = 0;
    let wrongCount = 0;
    let answeredCount = 0;
    const answerAnalysis: Record<
      string,
      {
        questionId: string;
        isCorrect: boolean | null;
        score: number;
        selectedOptionId?: string;
        correctOptionId?: string;
      }
    > = {};

    for (const answer of answers) {
      const quizQuestion = attempt.quiz.quizQuestions.find(
        (qq) => qq.questionId === answer.questionId,
      );
      if (!quizQuestion) continue;

      const question = quizQuestion.question;
      let isCorrect: boolean | null = null;
      let score = 0;

      if (
        question.type === 'MCQ' ||
        question.type === 'TRUE_FALSE' ||
        question.type === 'MULTI_SELECT'
      ) {
        const correctOption = question.options.find((o) => o.isCorrect);
        isCorrect = answer.optionId === correctOption?.id;
        score = isCorrect ? question.score : 0;
        answeredCount++;
        if (isCorrect) correctCount++;
        else wrongCount++;

        answerAnalysis[answer.questionId] = {
          questionId: answer.questionId,
          isCorrect,
          score,
          selectedOptionId: answer.optionId,
          correctOptionId: correctOption?.id,
        };
      } else if (question.type === 'ESSAY') {
        answeredCount++;
        const correctOption = question.options.find((o) => o.isCorrect);
        if (correctOption && answer.essayAnswer) {
          // Auto-grade: normalize both sides (trim + lowercase)
          const submitted = answer.essayAnswer.trim().toLowerCase();
          const expected = correctOption.text.trim().toLowerCase();
          isCorrect = submitted === expected;
          score = isCorrect ? question.score : 0;
        } else {
          // No correct key stored or no answer submitted — skip scoring
          isCorrect = answer.essayAnswer ? null : null;
          score = 0;
        }
        if (isCorrect === true) correctCount++;
        else if (isCorrect === false) wrongCount++;
        answerAnalysis[answer.questionId] = {
          questionId: answer.questionId,
          isCorrect,
          score,
        };
      }

      await this.prisma.studentAnswer.upsert({
        where: {
          attemptId_questionId: { attemptId, questionId: answer.questionId },
        },
        create: {
          attemptId,
          questionId: answer.questionId,
          optionId: answer.optionId || null,
          essayAnswer: answer.essayAnswer || null,
          isCorrect,
          score,
        },
        update: {
          optionId: answer.optionId || null,
          essayAnswer: answer.essayAnswer || null,
          isCorrect,
          score,
        },
      });
    }

    const totalQuestions = attempt.quiz.quizQuestions.length;
    const unansweredCount = totalQuestions - answeredCount;

    const totalScore = await this.prisma.studentAnswer.aggregate({
      where: { attemptId },
      _sum: { score: true },
    });
    const maxScore = attempt.quiz.quizQuestions.reduce(
      (sum, qq) => sum + qq.question.score,
      0,
    );
    const earnedScore = totalScore._sum.score || 0;
    const percentage =
      maxScore > 0 ? Math.round((earnedScore / maxScore) * 100) : 0;
    const isPassed = percentage >= attempt.quiz.passingScore;
    const grade = this.calculateGrade(percentage);

    const updated = await this.prisma.quizAttempt.update({
      where: { id: attemptId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        score: earnedScore,
        percentage,
        answeredCount,
        correctCount,
        isPassed,
      },
    });

    await this.prisma.quizResult.create({
      data: {
        attemptId,
        totalQuestions,
        correctCount,
        wrongCount,
        unansweredCount,
        score: updated.score || 0,
        maxScore,
        percentage: updated.percentage || 0,
        grade,
        isPassed,
        answerAnalysis,
      },
    });

    return this.prisma.quizAttempt.findUnique({
      where: { id: attemptId },
      include: {
        quiz: true,
        answers: { include: { question: true, option: true } },
        quizResult: true,
      },
    });
  }

  async getHistory(userId: string, quizId?: string) {
    return this.prisma.quizAttempt.findMany({
      where: {
        userId,
        ...(quizId ? { quizId } : {}),
      },
      include: {
        quiz: { select: { id: true, title: true, subject: true } },
        quizResult: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string, userId: string) {
    const attempt = await this.prisma.quizAttempt.findUnique({
      where: { id },
      include: {
        quiz: {
          include: {
            quizQuestions: {
              include: {
                question: { include: { options: true } },
              },
              orderBy: { order: 'asc' },
            },
          },
        },
        answers: { include: { question: true, option: true } },
        quizResult: true,
      },
    });
    if (!attempt) throw new NotFoundException('Attempt not found');
    if (attempt.userId !== userId)
      throw new ForbiddenException('Not your attempt');
    return attempt;
  }

  private calculateGrade(percentage: number): string {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'E';
  }
}
