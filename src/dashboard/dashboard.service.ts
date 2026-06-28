import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getSummary() {
    const totalStudents = await this.prisma.student.count();
    const classesCount = await this.prisma.class.count();
    const assignmentCount = await this.prisma.assignment.count();

    return {
      classesCount,
      totalStudents,
      assignmentCount,
    };
  }

  async getClasses() {
    return await this.prisma.class.findMany({
      include: { _count: { select: { students: true } } },
      orderBy: { name: 'asc' },
    });
  }

  getPendingTasks() {
    return [];
  }

  async getStudentSummary(userId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
      include: { class: true },
    });

    if (!student) {
      return {
        className: 'Unassigned',
        attendanceRate: 0,
        pendingAssignments: 0,
        completedAssignments: 0,
      };
    }

    const totalAttendances = await this.prisma.attendance.count({
      where: { studentId: student.id },
    });
    const presentCount = await this.prisma.attendance.count({
      where: { studentId: student.id, status: 'PRESENT' },
    });
    const attendanceRate =
      totalAttendances === 0
        ? 0
        : Math.round((presentCount / totalAttendances) * 100);

    const classSubjects = await this.prisma.classSubject.findMany({
      where: { classId: student.classId },
    });
    const classSubjectIds = classSubjects.map((cs) => cs.id);

    const allAssignments = await this.prisma.assignment.count({
      where: { classSubjectId: { in: classSubjectIds } },
    });

    const completedAssignments = await this.prisma.assignmentSubmission.count({
      where: { studentId: student.id },
    });

    const pendingAssignments = Math.max(
      0,
      allAssignments - completedAssignments,
    );

    return {
      className: student.class.name,
      attendanceRate,
      pendingAssignments,
      completedAssignments,
    };
  }

  async getExportData() {
    const attendances = await this.prisma.attendance.findMany({
      include: { student: true, class: true },
      orderBy: { date: 'desc' },
    });

    const grades = await this.prisma.assignmentSubmission.findMany({
      include: { student: true, assignment: true },
      orderBy: { submittedAt: 'desc' },
    });

    return { attendances, grades };
  }
}
