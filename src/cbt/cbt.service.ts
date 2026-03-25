import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CbtService {
  constructor(private prisma: PrismaService) {}

  async findAll(teacherId: string) {
    return (this.prisma as any).cBTTest.findMany({
      where: { teacherId },
      include: { _count: { select: { questions: true } } },
      orderBy: { scheduledDate: 'desc' }
    });
  }

  async findOne(id: string) {
    return (this.prisma as any).cBTTest.findUnique({
      where: { id },
      include: { questions: true }
    });
  }

  async create(teacherId: string, data: any) {
    return (this.prisma as any).cBTTest.create({
      data: {
        title: data.title,
        durationMins: parseInt(data.durationMins),
        instructions: data.instructions,
        scheduledDate: new Date(data.scheduledDate),
        status: data.status || 'DRAFT',
        classSubjectId: data.classSubjectId,
        teacherId
      }
    });
  }

  async update(id: string, data: any) {
    return (this.prisma as any).cBTTest.update({
      where: { id },
      data: {
        ...data,
        scheduledDate: data.scheduledDate ? new Date(data.scheduledDate) : undefined
      }
    });
  }

  async remove(id: string) {
    return (this.prisma as any).cBTTest.delete({ where: { id } });
  }

  // Questions Management
  async addQuestion(testId: string, data: any) {
    return (this.prisma as any).cBTQuestion.create({
      data: {
        testId,
        question: data.question,
        points: data.points || 1,
        options: data.options // JSON: [{ id: 'A', text: '...', isCorrect: true }]
      }
    });
  }

  async updateQuestion(id: string, data: any) {
    return (this.prisma as any).cBTQuestion.update({
      where: { id },
      data
    });
  }

  async deleteQuestion(id: string) {
    return (this.prisma as any).cBTQuestion.delete({ where: { id } });
  }

  // Student Facing
  async findForStudent(userId: string) {
    const student = await (this.prisma as any).student.findUnique({ where: { userId } });
    if (!student) return [];

    // Find tests for student's class
    const classSubjects = await (this.prisma as any).classSubject.findMany({ 
      where: { classId: student.classId } 
    });
    const csIds = classSubjects.map((cs: any) => cs.id);

    return (this.prisma as any).cBTTest.findMany({
      where: { 
        classSubjectId: { in: csIds },
        status: 'PUBLISHED'
      },
      include: {
        attempts: {
          where: { studentId: student.id },
          select: { status: true, score: true }
        }
      }
    });
  }

  async startAttempt(userId: string, testId: string) {
    const student = await (this.prisma as any).student.findUnique({ where: { userId } });
    if (!student) throw new BadRequestException("Student profile not found");

    const existing = await (this.prisma as any).cbtAttempt.findFirst({
      where: { studentId: student.id, testId, status: 'SUBMITTED' }
    });
    
    const test = await (this.prisma as any).cBTTest.findUnique({ where: { id: testId } });
    if (!test.allowRetakes && existing) {
      throw new ForbiddenException("Retakes are not allowed for this test");
    }

    return (this.prisma as any).cbtAttempt.create({
      data: {
        testId,
        studentId: student.id,
        status: 'IN_PROGRESS'
      }
    });
  }

  async submitAttempt(userId: string, attemptId: string, answers: any) {
    const attempt = await (this.prisma as any).cbtAttempt.findUnique({
      where: { id: attemptId },
      include: { 
        test: { include: { questions: true } },
        student: true
      }
    });

    if (!attempt || attempt.status === 'SUBMITTED') {
      throw new BadRequestException("Attempt invalid or already submitted");
    }

    // Auto grading
    let totalPoints = 0;
    let earnedPoints = 0;

    attempt.test.questions.forEach((q: any) => {
      totalPoints += q.points;
      const studentAnswer = answers.find((a: any) => a.questionId === q.id);
      if (studentAnswer) {
        const correctOption = q.options.find((opt: any) => opt.isCorrect);
        if (correctOption && correctOption.id === studentAnswer.selectedOption) {
          earnedPoints += q.points;
        }
      }
    });

    const score = (earnedPoints / totalPoints) * 100;

    return (this.prisma as any).cbtAttempt.update({
      where: { id: attemptId },
      data: {
        answers,
        score,
        status: 'SUBMITTED',
        endTime: new Date()
      }
    });
  }

  async getAttemptsByTest(testId: string) {
    return (this.prisma as any).cbtAttempt.findMany({
      where: { testId },
      include: { student: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateAttemptGrade(attemptId: string, data: any) {
    return (this.prisma as any).cbtAttempt.update({
      where: { id: attemptId },
      data: {
        score: parseFloat(data.score),
        feedback: data.feedback,
        status: 'GRADED'
      }
    });
  }
}
