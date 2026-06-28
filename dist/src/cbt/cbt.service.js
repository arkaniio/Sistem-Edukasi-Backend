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
exports.CbtService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CbtService = class CbtService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(teacherId) {
        return this.prisma.cBTTest.findMany({
            where: { teacherId },
            include: { _count: { select: { questions: true } } },
            orderBy: { scheduledDate: 'desc' }
        });
    }
    async findOne(id) {
        return this.prisma.cBTTest.findUnique({
            where: { id },
            include: { questions: true }
        });
    }
    async create(teacherId, data) {
        return this.prisma.cBTTest.create({
            data: {
                title: data.title,
                durationMins: parseInt(data.durationMins),
                instructions: data.instructions,
                scheduledDate: new Date(data.scheduledDate),
                status: data.status || 'DRAFT',
                classSubjectId: data.classSubjectId,
                teacherId
            }
        });
    }
    async update(id, data) {
        return this.prisma.cBTTest.update({
            where: { id },
            data: {
                ...data,
                scheduledDate: data.scheduledDate ? new Date(data.scheduledDate) : undefined
            }
        });
    }
    async remove(id) {
        return this.prisma.cBTTest.delete({ where: { id } });
    }
    async addQuestion(testId, data) {
        return this.prisma.cBTQuestion.create({
            data: {
                testId,
                question: data.question,
                points: data.points || 1,
                options: data.options
            }
        });
    }
    async updateQuestion(id, data) {
        return this.prisma.cBTQuestion.update({
            where: { id },
            data
        });
    }
    async deleteQuestion(id) {
        return this.prisma.cBTQuestion.delete({ where: { id } });
    }
    async findForStudent(userId) {
        const student = await this.prisma.student.findUnique({ where: { userId } });
        if (!student)
            return [];
        const classSubjects = await this.prisma.classSubject.findMany({
            where: { classId: student.classId }
        });
        const csIds = classSubjects.map((cs) => cs.id);
        return this.prisma.cBTTest.findMany({
            where: {
                classSubjectId: { in: csIds },
                status: 'PUBLISHED'
            },
            include: {
                attempts: {
                    where: { studentId: student.id },
                    select: { status: true, score: true }
                }
            }
        });
    }
    async startAttempt(userId, testId) {
        const student = await this.prisma.student.findUnique({ where: { userId } });
        if (!student)
            throw new common_1.BadRequestException("Student profile not found");
        const existing = await this.prisma.cbtAttempt.findFirst({
            where: { studentId: student.id, testId, status: 'SUBMITTED' }
        });
        const test = await this.prisma.cBTTest.findUnique({ where: { id: testId } });
        if (!test.allowRetakes && existing) {
            throw new common_1.ForbiddenException("Retakes are not allowed for this test");
        }
        return this.prisma.cbtAttempt.create({
            data: {
                testId,
                studentId: student.id,
                status: 'IN_PROGRESS'
            }
        });
    }
    async submitAttempt(userId, attemptId, answers) {
        const attempt = await this.prisma.cbtAttempt.findUnique({
            where: { id: attemptId },
            include: {
                test: { include: { questions: true } },
                student: true
            }
        });
        if (!attempt || attempt.status === 'SUBMITTED') {
            throw new common_1.BadRequestException("Attempt invalid or already submitted");
        }
        let totalPoints = 0;
        let earnedPoints = 0;
        attempt.test.questions.forEach((q) => {
            totalPoints += q.points;
            const studentAnswer = answers.find((a) => a.questionId === q.id);
            if (studentAnswer) {
                const correctOption = q.options.find((opt) => opt.isCorrect);
                if (correctOption && correctOption.id === studentAnswer.selectedOption) {
                    earnedPoints += q.points;
                }
            }
        });
        const score = (earnedPoints / totalPoints) * 100;
        return this.prisma.cbtAttempt.update({
            where: { id: attemptId },
            data: {
                answers,
                score,
                status: 'SUBMITTED',
                endTime: new Date()
            }
        });
    }
    async getAttemptsByTest(testId) {
        return this.prisma.cbtAttempt.findMany({
            where: { testId },
            include: { student: true },
            orderBy: { createdAt: 'desc' }
        });
    }
    async updateAttemptGrade(attemptId, data) {
        return this.prisma.cbtAttempt.update({
            where: { id: attemptId },
            data: {
                score: parseFloat(data.score),
                feedback: data.feedback,
                status: 'GRADED'
            }
        });
    }
};
exports.CbtService = CbtService;
exports.CbtService = CbtService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CbtService);
//# sourceMappingURL=cbt.service.js.map