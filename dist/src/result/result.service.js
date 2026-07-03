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
exports.ResultService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ResultService = class ResultService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getQuizResults(quizId) {
        const quiz = await this.prisma.quiz.findUnique({ where: { id: quizId } });
        if (!quiz)
            throw new common_1.NotFoundException('Quiz not found');
        const attempts = await this.prisma.quizAttempt.findMany({
            where: { quizId, status: 'COMPLETED' },
            include: {
                student: {
                    select: { id: true, firstName: true, lastName: true, nisn: true },
                },
                quizResult: true,
            },
            orderBy: { percentage: 'desc' },
        });
        const totalAttempts = await this.prisma.quizAttempt.count({
            where: { quizId },
        });
        const avgPercentage = attempts.length > 0
            ? Math.round(attempts.reduce((sum, a) => sum + (a.percentage || 0), 0) /
                attempts.length)
            : 0;
        const passRate = attempts.length > 0
            ? Math.round((attempts.filter((a) => a.isPassed).length / attempts.length) * 100)
            : 0;
        const totalStudents = new Set(attempts.map((a) => a.userId)).size;
        return {
            quiz: { id: quiz.id, title: quiz.title },
            stats: {
                totalAttempts,
                completedAttempts: attempts.length,
                averagePercentage: avgPercentage,
                averageScore: avgPercentage,
                passRate,
                totalStudents,
            },
            attempts,
        };
    }
    async getStudentResults(userId) {
        const attempts = await this.prisma.quizAttempt.findMany({
            where: { userId, status: 'COMPLETED' },
            include: {
                quiz: {
                    select: { id: true, title: true, subject: true, passingScore: true },
                },
                quizResult: true,
            },
            orderBy: { completedAt: 'desc' },
        });
        return { results: attempts };
    }
    async getGradeReport(userId) {
        const attempts = await this.prisma.quizAttempt.findMany({
            where: { userId, status: 'COMPLETED' },
            include: {
                quiz: { select: { id: true, title: true, subject: true } },
                quizResult: true,
            },
            orderBy: { completedAt: 'desc' },
        });
        const totalQuizzes = attempts.length;
        const passed = attempts.filter((a) => a.isPassed).length;
        const avgScore = totalQuizzes > 0
            ? Math.round(attempts.reduce((sum, a) => sum + (a.percentage || 0), 0) /
                totalQuizzes)
            : 0;
        const totalScore = attempts.reduce((sum, a) => sum + (a.score || 0), 0);
        const bySubject = {};
        for (const a of attempts) {
            const subjectName = a.quiz.subject?.name || 'General';
            if (!bySubject[subjectName])
                bySubject[subjectName] = { count: 0, totalPercentage: 0 };
            bySubject[subjectName].count++;
            bySubject[subjectName].totalPercentage += a.percentage || 0;
        }
        const subjectBreakdown = Object.entries(bySubject).map(([name, data]) => ({
            subject: name,
            attempts: data.count,
            averagePercentage: Math.round(data.totalPercentage / data.count),
        }));
        return {
            summary: {
                totalQuizzes,
                passed,
                failed: totalQuizzes - passed,
                avgScore,
                totalScore,
            },
            subjectBreakdown,
            recentAttempts: attempts.slice(0, 10),
            results: attempts,
        };
    }
};
exports.ResultService = ResultService;
exports.ResultService = ResultService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ResultService);
//# sourceMappingURL=result.service.js.map