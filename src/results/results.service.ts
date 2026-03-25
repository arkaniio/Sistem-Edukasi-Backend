import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ResultsService {
  constructor(private prisma: PrismaService) {}

  async getRecentResults(teacherId: string) {
    return this.prisma.resultBatch.findMany({
      where: { classSubject: { teacherId } },
      include: { classSubject: { include: { class: true, subject: true } } },
      orderBy: { uploadDate: 'desc' },
      take: 10
    });
  }

  async processCsv(teacherId: string, classId: string, subjectId: string, file: any) {
    const classSubject = await this.prisma.classSubject.findFirst({
      where: { teacherId, classId, subjectId }
    });
    if (!classSubject) return { success: false, message: 'Class/Subject not found or unauthorized' };
    
    // mock basic CSV result batch creation
    const batch = await this.prisma.resultBatch.create({
      data: {
        classSubjectId: classSubject.id,
        status: 'PUBLISHED'
      }
    });
    return { success: true, batchId: batch.id };
  }

  async getStudentEraper(userId: string) {
    const student = await (this.prisma as any).student.findUnique({
      where: { userId },
      include: {
        class: true,
        user: true,
        grades: { // StudentResult
          include: { batch: { include: { classSubject: { include: { subject: true } } } } }
        },
        submissions: { // AssignmentSubmission
          include: { assignment: { include: { classSubject: { include: { subject: true } } } } }
        },
        cbtAttempts: { // CbtAttempt
          include: { test: { include: { classSubject: { include: { subject: true } } } } }
        },
        attendances: true
      }
    });

    if (!student) return null;

    const subjectData: Record<string, { subject: string, scores: number[] }> = {};

    // 1. Collect from Manual Uploads
    if (student.grades) {
      student.grades.forEach((g: any) => {
        const sName = g.batch?.classSubject?.subject?.name || 'Unknown';
        if (!subjectData[sName]) subjectData[sName] = { subject: sName, scores: [] };
        subjectData[sName].scores.push(g.score);
      });
    }

    // 2. Collect from Assignments
    if (student.submissions) {
      student.submissions.forEach((s: any) => {
        if (s.grade !== null && s.grade !== undefined) {
          const sName = s.assignment?.classSubject?.subject?.name || 'Unknown';
          if (!subjectData[sName]) subjectData[sName] = { subject: sName, scores: [] };
          subjectData[sName].scores.push(s.grade);
        }
      });
    }

    // 3. Collect from CBT
    if (student.cbtAttempts) {
      student.cbtAttempts.forEach((a: any) => {
        if (a.score !== null && a.score !== undefined) {
          const sName = a.test?.classSubject?.subject?.name || 'Unknown';
          if (!subjectData[sName]) subjectData[sName] = { subject: sName, scores: [] };
          subjectData[sName].scores.push(a.score);
        }
      });
    }

    const performance = Object.values(subjectData).map(item => ({
      subject: item.subject,
      avg: item.scores.length > 0 ? item.scores.reduce((a, b) => a + b, 0) / item.scores.length : 0
    }));

    // Attendance stats
    const total = student.attendances?.length || 0;
    const present = student.attendances?.filter((a: any) => a.status === 'PRESENT').length || 0;

    return {
      studentInfo: {
        name: `${student.firstName} ${student.lastName}`,
        class: student.class?.name || 'Unassigned',
        nisn: student.userId ? student.userId.substring(0, 8).toUpperCase() : 'N/A',
      },
      academicPerformance: performance,
      attendance: {
         total,
         present,
         percentage: total > 0 ? (present / total) * 100 : 0
      }
    };
  }
}
