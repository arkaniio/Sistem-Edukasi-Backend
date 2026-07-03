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
    async getAdminStats() {
        const [totalUsers, totalStudents, totalTeachers, totalQuizzes, totalClasses, totalSubjects, recentUsers,] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.user.count({ where: { role: 'STUDENT' } }),
            this.prisma.user.count({ where: { role: 'TEACHER' } }),
            this.prisma.quiz.count(),
            this.prisma.class.count(),
            this.prisma.subject.count(),
            this.prisma.user.findMany({
                orderBy: { createdAt: 'desc' },
                take: 5,
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    role: true,
                    avatar: true,
                    isActive: true,
                    createdAt: true,
                },
            }),
        ]);
        return {
            totalUsers,
            totalStudents,
            totalTeachers,
            totalQuizzes,
            totalClasses,
            totalSubjects,
            recentUsers,
        };
    }
    async getTeacherStats(teacherUserId, timeframe = 'week') {
        const teacherClassSubjects = await this.prisma.classSubject.findMany({
            where: { teacherId: teacherUserId },
            include: { class: { include: { students: true } }, subject: true },
        });
        const classIds = [
            ...new Set(teacherClassSubjects.map((cs) => cs.classId)),
        ];
        const subjectIds = [
            ...new Set(teacherClassSubjects.map((cs) => cs.subjectId)),
        ];
        const allStudentIds = [
            ...new Set(teacherClassSubjects.flatMap((cs) => cs.class.students.map((s) => s.id))),
        ];
        const [totalClasses, totalSubjects, totalStudents, totalQuizzes, totalAssignments, recentQuizzes] = await Promise.all([
            classIds.length > 0
                ? this.prisma.class.count({ where: { id: { in: classIds } } })
                : Promise.resolve(0),
            subjectIds.length > 0
                ? this.prisma.subject.count({ where: { id: { in: subjectIds } } })
                : Promise.resolve(0),
            Promise.resolve(allStudentIds.length),
            this.prisma.quiz.count({ where: { createdById: teacherUserId } }),
            this.prisma.assignment.count(),
            this.prisma.quiz.findMany({
                where: { createdById: teacherUserId },
                orderBy: { createdAt: 'desc' },
                take: 5,
                include: {
                    subject: true,
                    _count: { select: { quizAttempts: true, quizQuestions: true } },
                },
            }),
        ]);
        const recentPerformance = await this.prisma.student.findMany({
            where: classIds.length > 0 ? { classId: { in: classIds } } : { id: 'none' },
            take: 5,
            include: {
                class: true,
                quizAttempts: {
                    take: 1,
                    orderBy: { createdAt: 'desc' },
                    include: { quizResult: true },
                },
            },
        });
        const now = new Date();
        const daysCount = timeframe === 'month' ? 30 : 7;
        const currentPeriodStart = new Date(now);
        currentPeriodStart.setUTCDate(now.getUTCDate() - daysCount);
        currentPeriodStart.setUTCHours(0, 0, 0, 0);
        const previousPeriodStart = new Date(currentPeriodStart);
        previousPeriodStart.setUTCDate(currentPeriodStart.getUTCDate() - daysCount);
        const attendanceWhere = classIds.length > 0 ? { classId: { in: classIds } } : {};
        const currentAttendances = await this.prisma.attendance.findMany({
            where: { ...attendanceWhere, date: { gte: currentPeriodStart, lte: now } },
        });
        const previousAttendances = await this.prisma.attendance.findMany({
            where: { ...attendanceWhere, date: { gte: previousPeriodStart, lt: currentPeriodStart } },
        });
        const calculateAvg = (atts) => {
            if (atts.length === 0)
                return 0;
            const presentCount = atts.filter((a) => a.status === 'PRESENT').length;
            return Math.round((presentCount / atts.length) * 100);
        };
        const currentAvg = calculateAvg(currentAttendances);
        const previousAvg = calculateAvg(previousAttendances);
        const attendanceChange = currentAvg - previousAvg;
        const trends = [];
        for (let i = daysCount - 1; i >= 0; i--) {
            const startOfDay = new Date(now);
            startOfDay.setUTCDate(now.getUTCDate() - i);
            startOfDay.setUTCHours(0, 0, 0, 0);
            const endOfDay = new Date(startOfDay);
            endOfDay.setUTCHours(23, 59, 59, 999);
            const dayAtts = currentAttendances.filter((a) => a.date >= startOfDay && a.date <= endOfDay);
            trends.push({
                day: timeframe === 'month'
                    ? startOfDay.getUTCDate().toString()
                    : startOfDay.toLocaleDateString('en-US', { weekday: 'short' }),
                peak: dayAtts.length,
                average: dayAtts.filter((a) => a.status === 'PRESENT').length,
            });
        }
        const studentAttendanceMap = new Map();
        for (const student of recentPerformance) {
            const studentAtts = await this.prisma.attendance.findMany({
                where: { studentId: student.id },
            });
            const presentCount = studentAtts.filter((a) => a.status === 'PRESENT').length;
            const rate = studentAtts.length > 0
                ? Math.round((presentCount / studentAtts.length) * 100)
                : 0;
            studentAttendanceMap.set(student.id, rate);
        }
        return {
            totalClasses,
            totalSubjects,
            totalStudents,
            totalQuizzes,
            totalAssignments,
            recentQuizzes,
            avgAttendance: currentAvg,
            attendanceChange: attendanceChange,
            studentChange: 0,
            activeClasses: totalClasses,
            participationTrends: trends,
            recentPerformance: recentPerformance.map((s) => ({
                id: s.id,
                firstName: s.firstName,
                lastName: s.lastName,
                className: s.class?.name || 'Unassigned',
                avgScore: s.quizAttempts[0]?.quizResult?.percentage || 0,
                attendance: studentAttendanceMap.get(s.id) || 0,
            })),
        };
    }
    async getStudentStats(userId) {
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
                totalAttempts: 0,
                completedAttempts: 0,
                averageScore: 0,
                passedCount: 0,
                recentResults: [],
                attendanceStats: [],
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
        if (!student.classId) {
            return {
                className: student.class?.name || 'Unassigned',
                attendanceRate,
                pendingAssignments: 0,
                completedAssignments: 0,
                totalAttempts: 0,
                completedAttempts: 0,
                averageScore: 0,
                passedCount: 0,
                recentResults: [],
                attendanceStats: [],
            };
        }
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
        const attempts = await this.prisma.quizAttempt.findMany({
            where: { userId },
            include: { quiz: true },
            orderBy: { createdAt: 'desc' },
            take: 5,
        });
        const passedCount = await this.prisma.quizAttempt.count({
            where: { userId, isPassed: true },
        });
        const completedAttemptsCount = await this.prisma.quizAttempt.count({
            where: { userId, status: 'COMPLETED' },
        });
        const totalAttempts = await this.prisma.quizAttempt.count({
            where: { userId },
        });
        const allCompleted = await this.prisma.quizAttempt.findMany({
            where: { userId, status: 'COMPLETED' },
            select: { percentage: true },
        });
        const averageScore = allCompleted.length > 0
            ? Math.round(allCompleted.reduce((sum, a) => sum + (a.percentage || 0), 0) /
                allCompleted.length)
            : 0;
        const attendances = await this.prisma.attendance.groupBy({
            by: ['status'],
            where: { studentId: student.id },
            _count: true,
        });
        const attendanceStats = attendances.map((a) => ({
            status: a.status,
            _count: a._count,
        }));
        return {
            className: student.class?.name || 'Unassigned',
            attendanceRate,
            pendingAssignments,
            completedAssignments,
            totalAttempts,
            completedAttempts: completedAttemptsCount,
            averageScore,
            passedCount,
            recentResults: attempts,
            attendanceStats,
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