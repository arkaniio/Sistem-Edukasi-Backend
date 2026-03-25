import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getSummary(teacherId: string) {
    // Return global counts for now so the dashboard isn't empty
    const totalStudents = await (this.prisma as any).student.count();
    const classesCount = await (this.prisma as any).class.count();
    const assignmentCount = await (this.prisma as any).assignment.count();
    const activeCbtCount = await (this.prisma as any).cBTTest.count({
      where: { status: 'PUBLISHED' }
    });

    return { 
      classesCount, 
      totalStudents, 
      assignmentCount, 
      activeCbtCount 
    };
  }

  async getClasses(teacherId: string) {
    return (this.prisma as any).class.findMany({
      include: { _count: { select: { students: true } } },
      orderBy: { name: 'asc' }
    });
  }

  async getPendingTasks(teacherId: string) {
    return [];
  }

  async getStudentSummary(userId: string) {
    const student = await (this.prisma as any).student.findUnique({
      where: { userId },
      include: { class: true }
    });

    if (!student) {
      return { className: 'Unassigned', attendanceRate: 0, pendingAssignments: 0, completedAssignments: 0 };
    }

    const totalAttendances = await (this.prisma as any).attendance.count({ where: { studentId: student.id } });
    const presentCount = await (this.prisma as any).attendance.count({ where: { studentId: student.id, status: 'PRESENT' } });
    const attendanceRate = totalAttendances === 0 ? 0 : Math.round((presentCount / totalAttendances) * 100);

    const classSubjects = await (this.prisma as any).classSubject.findMany({ where: { classId: student.classId } });
    const classSubjectIds = classSubjects.map((cs: any) => cs.id);
    
    const allAssignments = await (this.prisma as any).assignment.count({
      where: { classSubjectId: { in: classSubjectIds } }
    });

    const completedAssignments = await (this.prisma as any).assignmentSubmission.count({
      where: { studentId: student.id }
    });

    const pendingAssignments = Math.max(0, allAssignments - completedAssignments);

    return {
      className: student.class.name,
      attendanceRate,
      pendingAssignments,
      completedAssignments
    };
  }

  async getExportData(teacherId: string) {
    const attendances = await (this.prisma as any).attendance.findMany({
      include: { student: true, class: true },
      orderBy: { date: 'desc' }
    });

    const grades = await (this.prisma as any).assignmentSubmission.findMany({
      include: { student: true, assignment: true },
      orderBy: { submittedAt: 'desc' }
    });

    return { attendances, grades };
  }
}
