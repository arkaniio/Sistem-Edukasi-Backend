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
exports.ResultsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ResultsService = class ResultsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getRecentResults(teacherId) {
        return this.prisma.resultBatch.findMany({
            where: { classSubject: { teacherId } },
            include: { classSubject: { include: { class: true, subject: true } } },
            orderBy: { uploadDate: 'desc' },
            take: 10
        });
    }
    async processCsv(teacherId, classId, subjectId, file) {
        const classSubject = await this.prisma.classSubject.findFirst({
            where: { teacherId, classId, subjectId }
        });
        if (!classSubject)
            return { success: false, message: 'Class/Subject not found or unauthorized' };
        const batch = await this.prisma.resultBatch.create({
            data: {
                classSubjectId: classSubject.id,
                status: 'PUBLISHED'
            }
        });
        return { success: true, batchId: batch.id };
    }
    async getStudentEraper(userId) {
        const student = await this.prisma.student.findUnique({
            where: { userId },
            include: {
                class: true,
                user: true,
                grades: {
                    include: { batch: { include: { classSubject: { include: { subject: true } } } } }
                },
                submissions: {
                    include: { assignment: { include: { classSubject: { include: { subject: true } } } } }
                },
                cbtAttempts: {
                    include: { test: { include: { classSubject: { include: { subject: true } } } } }
                },
                attendances: true
            }
        });
        if (!student)
            return null;
        const subjectData = {};
        if (student.grades) {
            student.grades.forEach((g) => {
                const sName = g.batch?.classSubject?.subject?.name || 'Unknown';
                if (!subjectData[sName])
                    subjectData[sName] = { subject: sName, scores: [] };
                subjectData[sName].scores.push(g.score);
            });
        }
        if (student.submissions) {
            student.submissions.forEach((s) => {
                if (s.grade !== null && s.grade !== undefined) {
                    const sName = s.assignment?.classSubject?.subject?.name || 'Unknown';
                    if (!subjectData[sName])
                        subjectData[sName] = { subject: sName, scores: [] };
                    subjectData[sName].scores.push(s.grade);
                }
            });
        }
        if (student.cbtAttempts) {
            student.cbtAttempts.forEach((a) => {
                if (a.score !== null && a.score !== undefined) {
                    const sName = a.test?.classSubject?.subject?.name || 'Unknown';
                    if (!subjectData[sName])
                        subjectData[sName] = { subject: sName, scores: [] };
                    subjectData[sName].scores.push(a.score);
                }
            });
        }
        const performance = Object.values(subjectData).map(item => ({
            subject: item.subject,
            avg: item.scores.length > 0 ? item.scores.reduce((a, b) => a + b, 0) / item.scores.length : 0
        }));
        const total = student.attendances?.length || 0;
        const present = student.attendances?.filter((a) => a.status === 'PRESENT').length || 0;
        return {
            studentInfo: {
                name: `${student.firstName} ${student.lastName}`,
                class: student.class?.name || 'Unassigned',
                nisn: student.userId ? student.userId.substring(0, 8).toUpperCase() : 'N/A',
            },
            academicPerformance: performance,
            attendance: {
                total,
                present,
                percentage: total > 0 ? (present / total) * 100 : 0
            }
        };
    }
};
exports.ResultsService = ResultsService;
exports.ResultsService = ResultsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ResultsService);
//# sourceMappingURL=results.service.js.map