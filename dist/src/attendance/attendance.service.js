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
let AttendanceService = class AttendanceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(teacherId) {
        return this.prisma.attendance.findMany({
            include: { student: true, class: true },
            orderBy: { date: 'desc' }
        });
    }
    create(data) {
        return this.prisma.attendance.create({ data: {
                date: new Date(data.date),
                status: data.status,
                studentId: data.studentId,
                classId: data.classId
            } });
    }
    async findForStudent(userId) {
        const student = await this.prisma.student.findUnique({ where: { userId } });
        if (!student)
            return [];
        return this.prisma.attendance.findMany({
            where: { studentId: student.id },
            include: { class: true },
            orderBy: { date: 'desc' }
        });
    }
    async markStudentAttendance(userId, status = 'PRESENT') {
        const student = await this.prisma.student.findUnique({ where: { userId } });
        if (!student)
            throw new Error("Student profile not found");
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const existing = await this.prisma.attendance.findFirst({
            where: {
                studentId: student.id,
                date: { gte: today }
            }
        });
        if (existing) {
            throw new Error("Attendance already marked for today");
        }
        return this.prisma.attendance.create({
            data: {
                date: new Date(),
                status: status,
                studentId: student.id,
                classId: student.classId
            }
        });
    }
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AttendanceService);
//# sourceMappingURL=attendance.service.js.map