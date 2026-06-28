import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    const findUser = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!findUser) return [];

    if (findUser?.role === 'STUDENT') {
      return await this.prisma.attendance.findMany({
        where: { studentId: findUser.id },
        include: { class: true },
        orderBy: { date: 'desc' },
      });
    }

    return await this.prisma.attendance.findMany({
      include: { student: true, class: true },
      orderBy: { date: 'desc' },
    });
  }

  async create(data: CreateAttendanceDto) {
    return await this.prisma.attendance.create({
      data: {
        date: new Date(data.date),
        status: data.status,
        studentId: data.studentId,
        classId: data.classId,
      },
    });
  }

  async markStudentAttendance(userId: string, status: string = 'PRESENT') {
    const student = await this.prisma.student.findUnique({ where: { userId } });
    if (!student) throw new NotFoundException('Student profile not found');

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const existing = await this.prisma.attendance.findFirst({
      where: {
        studentId: student.id,
        date: { gte: today },
      },
    });

    if (existing) {
      throw new BadRequestException('Attendance already marked for today');
    }

    return await this.prisma.attendance.create({
      data: {
        date: new Date(),
        status: status,
        studentId: student.id,
        classId: student.classId,
      },
    });
  }
}
