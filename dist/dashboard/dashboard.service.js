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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DashboardService = class DashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
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
    async getStudentSummary(userId) {
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
        const attendanceRate = totalAttendances === 0
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
        const pendingAssignments = Math.max(0, allAssignments - completedAssignments);
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
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map