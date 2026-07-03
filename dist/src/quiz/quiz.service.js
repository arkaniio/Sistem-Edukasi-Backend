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
exports.QuizService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let QuizService = class QuizService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(params) {
        const where = {};
        if (params?.status)
            where.status = params.status;
        if (params?.subjectId)
            where.subjectId = params.subjectId;
        if (params?.search) {
            where.OR = [
                { title: { contains: params.search, mode: 'insensitive' } },
                { description: { contains: params.search, mode: 'insensitive' } },
            ];
        }
        return this.prisma.quiz.findMany({
            where,
            include: {
                _count: { select: { quizQuestions: true, quizAttempts: true } },
                subject: true,
                createdBy: { select: { id: true, firstName: true, lastName: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findForStudent(userId) {
        const student = await this.prisma.student.findUnique({ where: { userId } });
        if (!student)
            return [];
        return this.prisma.quiz.findMany({
            where: { status: 'PUBLISHED' },
            include: {
                _count: { select: { quizQuestions: true } },
                subject: true,
                quizAttempts: {
                    where: { userId },
                    select: {
                        id: true,
                        status: true,
                        score: true,
                        percentage: true,
                        attemptNumber: true,
                        completedAt: true,
                    },
                    orderBy: { attemptNumber: 'desc' },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findById(id) {
        const quiz = await this.prisma.quiz.findUnique({
            where: { id },
            include: {
                subject: true,
                createdBy: { select: { id: true, firstName: true, lastName: true } },
                quizQuestions: {
                    include: {
                        question: { include: { options: { orderBy: { label: 'asc' } } } },
                    },
                    orderBy: { order: 'asc' },
                },
                _count: { select: { quizAttempts: true } },
            },
        });
        if (!quiz)
            throw new common_1.NotFoundException('Quiz not found');
        return quiz;
    }
    async create(userId, dto) {
        return this.prisma.quiz.create({
            data: {
                title: dto.title,
                description: dto.description,
                difficulty: dto.difficulty || 'MEDIUM',
                timeLimit: dto.timeLimit,
                passingScore: dto.passingScore || 0,
                subjectId: dto.subjectId,
                createdById: userId,
                shuffleQuestions: dto.shuffleQuestions || false,
                showResults: dto.showResults !== false,
                maxAttempts: dto.maxAttempts || 1,
            },
        });
    }
    async update(id, dto) {
        await this.findById(id);
        return this.prisma.quiz.update({ where: { id }, data: dto });
    }
    async publish(id) {
        const quiz = await this.findById(id);
        if (quiz.quizQuestions.length === 0)
            throw new common_1.BadRequestException('Cannot publish quiz with no questions');
        return this.prisma.quiz.update({
            where: { id },
            data: { status: 'PUBLISHED' },
        });
    }
    async close(id) {
        await this.findById(id);
        return this.prisma.quiz.update({
            where: { id },
            data: { status: 'CLOSED' },
        });
    }
    async addQuestions(quizId, questionIds) {
        const quiz = await this.findById(quizId);
        if (quiz.status !== 'DRAFT')
            throw new common_1.BadRequestException('Can only add questions to draft quizzes');
        const existingCount = await this.prisma.quizQuestion.count({
            where: { quizId },
        });
        const data = questionIds.map((questionId, i) => ({
            quizId,
            questionId,
            order: existingCount + i + 1,
        }));
        await this.prisma.quizQuestion.createMany({ data });
        return this.findById(quizId);
    }
    async removeQuestion(quizId, questionId) {
        await this.prisma.quizQuestion.deleteMany({
            where: { quizId, questionId },
        });
        return this.findById(quizId);
    }
    async delete(id) {
        await this.findById(id);
        const quizQuestions = await this.prisma.quizQuestion.findMany({
            where: { quizId: id },
            include: { question: { select: { questionBankId: true } } },
        });
        const bankIds = [
            ...new Set(quizQuestions.map((qq) => qq.question.questionBankId)),
        ].filter(Boolean);
        await this.prisma.quizQuestion.deleteMany({ where: { quizId: id } });
        await this.prisma.quiz.delete({ where: { id } });
        if (bankIds.length > 0) {
            await this.prisma.questionBank.updateMany({
                where: { id: { in: bankIds } },
                data: { isDraft: true },
            });
        }
        return { message: 'Quiz deleted' };
    }
};
exports.QuizService = QuizService;
exports.QuizService = QuizService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QuizService);
//# sourceMappingURL=quiz.service.js.map