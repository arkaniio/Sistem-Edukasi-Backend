import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async findAll(teacherId?: string) {
    return (this.prisma as any).attendance.findMany({ 
      include: { student: true, class: true }, 
      orderBy: { date: 'desc' } 
    });
  }

  create(data: any) {
    return (this.prisma as any).attendance.create({ data: {
      date: new Date(data.date),
      status: data.status,
      studentId: data.studentId,
      classId: data.classId
    }});
  }

  async findForStudent(userId: string) {
    const student = await (this.prisma as any).student.findUnique({ where: { userId } });
    if (!student) return [];
    return (this.prisma as any).attendance.findMany({
      where: { studentId: student.id },
      include: { class: true },
      orderBy: { date: 'desc' }
    });
  }

  async markStudentAttendance(userId: string, status: string = 'PRESENT') {
    const student = await (this.prisma as any).student.findUnique({ where: { userId } });
    if (!student) throw new Error("Student profile not found");
    
    const today = new Date();
    today.setHours(0,0,0,0);
    const existing = await (this.prisma as any).attendance.findFirst({
      where: {
        studentId: student.id,
        date: { gte: today }
      }
    });

    if (existing) {
      throw new Error("Attendance already marked for today");
    }

    return (this.prisma as any).attendance.create({
      data: {
        date: new Date(),
        status: status,
        studentId: student.id,
        classId: student.classId
      }
    });
  }
}
