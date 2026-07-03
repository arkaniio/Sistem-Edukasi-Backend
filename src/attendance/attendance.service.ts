import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { $Enums } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

/** Return UTC midnight of the given date string (YYYY-MM-DD) or today */
function utcMidnight(dateStr?: string): Date {
  const d = dateStr ? new Date(dateStr) : new Date();
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0),
  );
}

/** Local (WIB = UTC+7) today as UTC midnight */
function localTodayUtcMidnight(): Date {
  // Offset +7 hours so that "today" in WIB is always correct
  const wibOffset = 7 * 60 * 60 * 1000;
  const wibNow = new Date(Date.now() + wibOffset);
  return new Date(
    Date.UTC(
      wibNow.getUTCFullYear(),
      wibNow.getUTCMonth(),
      wibNow.getUTCDate(),
      0,
      0,
      0,
      0,
    ),
  );
}

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    userId: string,
    params?: { classId?: string; date?: string; studentId?: string },
  ) {
    const findUser = await this.prisma.user.findFirst({
      where: { id: userId },
    });

    if (!findUser) return [];

    const whereClause: any = {};
    if (params?.classId) whereClause.classId = params.classId;
    if (params?.studentId) whereClause.studentId = params.studentId;
    if (params?.date) {
      const targetDate = utcMidnight(params.date);
      const nextDate = new Date(targetDate);
      nextDate.setUTCDate(nextDate.getUTCDate() + 1);
      whereClause.date = { gte: targetDate, lt: nextDate };
    }

    if (findUser?.role === 'STUDENT') {
      const student = await this.prisma.student.findUnique({
        where: { userId: findUser.id },
      });
      if (!student) return [];
      whereClause.studentId = student.id;
      return await this.prisma.attendance.findMany({
        where: whereClause,
        include: { class: true },
        orderBy: { date: 'desc' },
      });
    }

    return await this.prisma.attendance.findMany({
      where: whereClause,
      include: { student: true, class: true },
      orderBy: { date: 'desc' },
    });
  }

  async create(data: CreateAttendanceDto) {
    return await this.prisma.attendance.create({
      data: {
        date: utcMidnight(data.date),
        status: data.status as $Enums.AttendanceStatus,
        studentId: data.studentId,
        classId: data.classId,
      },
    });
  }

  async markBulkAttendance(
    classId: string,
    date: string,
    records: { studentId: string; status: any }[],
  ) {
    const targetDate = utcMidnight(date);

    const operations = records.map((record) => {
      return this.prisma.attendance.upsert({
        where: {
          studentId_classId_date: {
            studentId: record.studentId,
            classId: classId,
            date: targetDate,
          },
        },
        create: {
          studentId: record.studentId,
          classId: classId,
          date: targetDate,
          status: record.status as $Enums.AttendanceStatus,
        },
        update: {
          status: record.status as $Enums.AttendanceStatus,
        },
      });
    });

    return await this.prisma.$transaction(operations);
  }

  async updateStatus(id: string, status: string) {
    return await this.prisma.attendance.update({
      where: { id },
      data: { status: status as $Enums.AttendanceStatus },
    });
  }

  async getStudentAttendance(userId: string, classId?: string, month?: string) {
    const student = await this.prisma.student.findUnique({ where: { userId } });
    if (!student) throw new NotFoundException('Student profile not found');

    const whereClause: any = { studentId: student.id };
    if (classId) whereClause.classId = classId;
    if (month) {
      const startDate = new Date(`${month}-01`);
      const endDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth() + 1,
        0,
      );
      whereClause.date = { gte: startDate, lte: endDate };
    }

    return await this.prisma.attendance.findMany({
      where: whereClause,
      include: { class: true },
      orderBy: { date: 'desc' },
    });
  }

  async getSummary(classId: string, month?: string) {
    const whereClause: any = { classId };
    if (month) {
      const startDate = new Date(`${month}-01`);
      const endDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth() + 1,
        0,
      );
      whereClause.date = { gte: startDate, lte: endDate };
    }

    const attendances = await this.prisma.attendance.groupBy({
      by: ['status'],
      where: whereClause,
      _count: true,
    });

    const summary: Record<string, number> = {
      PRESENT: 0,
      ABSENT: 0,
      LATE: 0,
      EXCUSED: 0,
    };

    attendances.forEach((a) => {
      summary[a.status] = a._count;
    });

    return summary;
  }

  async markStudentAttendance(userId: string, status: string = 'PRESENT') {
    const student = await this.prisma.student.findUnique({ where: { userId } });
    if (!student) throw new NotFoundException('Student profile not found');
    if (!student.classId)
      throw new BadRequestException('Student has no class assigned');

    const today = localTodayUtcMidnight();
    const tomorrow = new Date(today);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

    const existing = await this.prisma.attendance.findFirst({
      where: {
        studentId: student.id,
        date: { gte: today, lt: tomorrow },
      },
    });

    if (existing) {
      throw new BadRequestException('Attendance already marked for today');
    }

    // Save at UTC midnight of today so it is consistent with teacher bulk records
    return await this.prisma.attendance.create({
      data: {
        date: today,
        status: status as $Enums.AttendanceStatus,
        studentId: student.id,
        classId: student.classId,
      },
    });
  }

  async getStats(classId?: string, date?: string) {
    const whereClause: any = {};
    if (classId) whereClause.classId = classId;
    if (date) {
      const targetDate = utcMidnight(date);
      const nextDate = new Date(targetDate);
      nextDate.setUTCDate(nextDate.getUTCDate() + 1);
      whereClause.date = { gte: targetDate, lt: nextDate };
    }

    const attendances = await this.prisma.attendance.findMany({
      where: whereClause,
      include: { student: true },
    });

    const presentCount = attendances.filter(
      (a) => a.status === 'PRESENT',
    ).length;
    const absentCount = attendances.filter((a) => a.status === 'ABSENT').length;
    const lateCount = attendances.filter((a) => a.status === 'LATE').length;
    const totalRecords = attendances.length;

    // Perfect attendance: students who have NEVER been absent/late in this class
    // (all of their records for this class are PRESENT or EXCUSED)
    let perfectRecords = 0;
    if (classId) {
      const studentIds = [
        ...new Set(attendances.map((a) => a.studentId)),
      ];
      for (const studentId of studentIds) {
        const allForStudent = await this.prisma.attendance.findMany({
          where: { studentId, classId },
        });
        const hasBadRecord = allForStudent.some(
          (a) => a.status === 'ABSENT' || a.status === 'LATE',
        );
        if (!hasBadRecord && allForStudent.length > 0) perfectRecords++;
      }
    }

    return {
      overview: { present: presentCount, absent: absentCount, late: lateCount },
      avgEntryTime: 'N/A',
      totalRecords,
      presentPercentage:
        totalRecords > 0 ? Math.round((presentCount / totalRecords) * 100) : 0,
      lateEntries: lateCount,
      perfectRecords,
    };
  }
}
