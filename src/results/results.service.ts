import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const studentEraperInclude = {
  class: true,
  user: true,
  grades: {
    include: {
      batch: {
        include: { classSubject: { include: { subject: true } } },
      },
    },
  },
  submissions: {
    include: {
      assignment: {
        include: { classSubject: { include: { subject: true } } },
      },
    },
  },
  attendances: true,
} satisfies Prisma.StudentInclude;

type StudentEraper = Prisma.StudentGetPayload<{
  include: typeof studentEraperInclude;
}>;

@Injectable()
export class ResultsService {
  constructor(private prisma: PrismaService) {}

  async getRecentResults(teacherId: string) {
    return await this.prisma.resultBatch.findMany({
      where: { classSubject: { teacherId } },
      include: { classSubject: { include: { class: true, subject: true } } },
      orderBy: { uploadDate: 'desc' },
      take: 10,
    });
  }

  async processCsv(teacherId: string, classId: string, subjectId: string) {
    const classSubject = await this.prisma.classSubject.findFirst({
      where: { teacherId, classId, subjectId },
    });
    if (!classSubject)
      return {
        success: false,
        message: 'Class/Subject not found or unauthorized',
      };

    const batch = await this.prisma.resultBatch.create({
      data: {
        classSubjectId: classSubject.id,
        status: 'PUBLISHED',
      },
    });
    return { success: true, batchId: batch.id };
  }

  async getStudentEraper(userId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
      include: studentEraperInclude,
    });

    if (!student) return null;

    return this.buildEraperReport(student);
  }

  private buildEraperReport(student: StudentEraper) {
    const subjectData: Record<string, { subject: string; scores: number[] }> =
      {};

    for (const grade of student.grades) {
      const sName = grade.batch.classSubject.subject.name;
      if (!subjectData[sName])
        subjectData[sName] = { subject: sName, scores: [] };
      subjectData[sName].scores.push(grade.score);
    }

    for (const submission of student.submissions) {
      if (submission.grade !== null && submission.grade !== undefined) {
        const sName = submission.assignment.classSubject.subject.name;
        if (!subjectData[sName])
          subjectData[sName] = { subject: sName, scores: [] };
        subjectData[sName].scores.push(submission.grade);
      }
    }

    const performance = Object.values(subjectData).map((item) => ({
      subject: item.subject,
      avg:
        item.scores.length > 0
          ? item.scores.reduce((a, b) => a + b, 0) / item.scores.length
          : 0,
    }));

    const total = student.attendances.length;
    const present = student.attendances.filter(
      (a) => a.status === 'PRESENT',
    ).length;

    return {
      studentInfo: {
        name: `${student.firstName} ${student.lastName}`,
        class: student.class?.name ?? 'Unassigned',
        nisn: student.userId
          ? student.userId.substring(0, 8).toUpperCase()
          : 'N/A',
      },
      academicPerformance: performance,
      attendance: {
        total,
        present,
        percentage: total > 0 ? (present / total) * 100 : 0,
      },
    };
  }
}
