"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
function utcMidnight(dateStr) {
    const d = dateStr ? new Date(dateStr) : new Date();
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0));
}
function localTodayUtcMidnight() {
    const wibOffset = 7 * 60 * 60 * 1000;
    const wibNow = new Date(Date.now() + wibOffset);
    return new Date(Date.UTC(wibNow.getUTCFullYear(), wibNow.getUTCMonth(), wibNow.getUTCDate(), 0, 0, 0, 0));
}
let AttendanceService = class AttendanceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(userId, params) {
        const findUser = await this.prisma.user.findFirst({
            where: { id: userId },
        });
        if (!findUser)
            return [];
        const whereClause = {};
        if (params?.classId)
            whereClause.classId = params.classId;
        if (params?.studentId)
            whereClause.studentId = params.studentId;
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
            if (!student)
                return [];
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
    async create(data) {
        return await this.prisma.attendance.create({
            data: {
                date: utcMidnight(data.date),
                status: data.status,
                studentId: data.studentId,
                classId: data.classId,
            },
        });
    }
    async markBulkAttendance(classId, date, records) {
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
                    status: record.status,
                },
                update: {
                    status: record.status,
                },
            });
        });
        return await this.prisma.$transaction(operations);
    }
    async updateStatus(id, status) {
        return await this.prisma.attendance.update({
            where: { id },
            data: { status: status },
        });
    }
    async getStudentAttendance(userId, classId, month) {
        const student = await this.prisma.student.findUnique({ where: { userId } });
        if (!student)
            throw new common_1.NotFoundException('Student profile not found');
        const whereClause = { studentId: student.id };
        if (classId)
            whereClause.classId = classId;
        if (month) {
            const startDate = new Date(`${month}-01`);
            const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
            whereClause.date = { gte: startDate, lte: endDate };
        }
        return await this.prisma.attendance.findMany({
            where: whereClause,
            include: { class: true },
            orderBy: { date: 'desc' },
        });
    }
    async getSummary(classId, month) {
        const whereClause = { classId };
        if (month) {
            const startDate = new Date(`${month}-01`);
            const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
            whereClause.date = { gte: startDate, lte: endDate };
        }
        const attendances = await this.prisma.attendance.groupBy({
            by: ['status'],
            where: whereClause,
            _count: true,
        });
        const summary = {
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
    async markStudentAttendance(userId, status = 'PRESENT') {
        const student = await this.prisma.student.findUnique({ where: { userId } });
        if (!student)
            throw new common_1.NotFoundException('Student profile not found');
        if (!student.classId)
            throw new common_1.BadRequestException('Student has no class assigned');
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
            throw new common_1.BadRequestException('Attendance already marked for today');
        }
        return await this.prisma.attendance.create({
            data: {
                date: today,
                status: status,
                studentId: student.id,
                classId: student.classId,
            },
        });
    }
    async getStats(classId, date) {
        const whereClause = {};
        if (classId)
            whereClause.classId = classId;
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
        const presentCount = attendances.filter((a) => a.status === 'PRESENT').length;
        const absentCount = attendances.filter((a) => a.status === 'ABSENT').length;
        const lateCount = attendances.filter((a) => a.status === 'LATE').length;
        const totalRecords = attendances.length;
        let perfectRecords = 0;
        if (classId) {
            const studentIds = [
                ...new Set(attendances.map((a) => a.studentId)),
            ];
            for (const studentId of studentIds) {
                const allForStudent = await this.prisma.attendance.findMany({
                    where: { studentId, classId },
                });
                const hasBadRecord = allForStudent.some((a) => a.status === 'ABSENT' || a.status === 'LATE');
                if (!hasBadRecord && allForStudent.length > 0)
                    perfectRecords++;
            }
        }
        return {
            overview: { present: presentCount, absent: absentCount, late: lateCount },
            avgEntryTime: 'N/A',
            totalRecords,
            presentPercentage: totalRecords > 0 ? Math.round((presentCount / totalRecords) * 100) : 0,
            lateEntries: lateCount,
            perfectRecords,
        };
    }
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AttendanceService);
//# sourceMappingURL=attendance.service.js.map