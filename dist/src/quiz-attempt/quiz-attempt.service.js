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
exports.QuizAttemptService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let QuizAttemptService = class QuizAttemptService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async startAttempt(userId, quizId) {
        const quiz = await this.prisma.quiz.findUnique({
            where: { id: quizId },
            include: {
                quizQuestions: {
                    include: {
                        question: { include: { options: { orderBy: { label: 'asc' } } } },
                    },
                    orderBy: { order: 'asc' },
                },
            },
        });
        if (!quiz)
            throw new common_1.NotFoundException('Quiz not found');
        if (quiz.status !== 'PUBLISHED')
            throw new common_1.BadRequestException('Quiz is not published');
        const student = await this.prisma.student.findUnique({ where: { userId } });
        if (!student)
            throw new common_1.BadRequestException('Student profile not found');
        const existingAttempts = await this.prisma.quizAttempt.count({
            where: { quizId, userId },
        });
        if (quiz.maxAttempts > 1 && existingAttempts >= quiz.maxAttempts) {
            throw new common_1.BadRequestException('Maximum attempts reached');
        }
        const inProgress = await this.prisma.quizAttempt.findFirst({
            where: { quizId, userId, status: 'IN_PROGRESS' },
            include: {
                quiz: {
                    include: {
                        quizQuestions: {
                            include: {
                                question: {
                                    include: { options: { orderBy: { label: 'asc' } } },
                                },
                            },
                            orderBy: { order: 'asc' },
                        },
                    },
                },
            },
        });
        if (inProgress)
            return inProgress;
        return this.prisma.quizAttempt.create({
            data: {
                quizId,
                userId,
                studentId: student.id,
                totalQuestions: quiz.quizQuestions.length,
                attemptNumber: existingAttempts + 1,
            },
            include: {
                quiz: {
                    include: {
                        quizQuestions: {
                            include: {
                                question: {
                                    include: {
                                        options: { orderBy: { label: 'asc' } },
                                    },
                                },
                            },
                            orderBy: { order: 'asc' },
                        },
                    },
                },
            },
        });
    }
    async submitAttempt(userId, attemptId, answers) {
        const attempt = await this.prisma.quizAttempt.findUnique({
            where: { id: attemptId },
            include: {
                quiz: {
                    include: {
                        quizQuestions: {
                            include: { question: { include: { options: true } } },
                        },
                    },
                },
            },
        });
        if (!attempt)
            throw new common_1.NotFoundException('Attempt not found');
        if (attempt.userId !== userId)
            throw new common_1.ForbiddenException('Not your attempt');
        if (attempt.status !== 'IN_PROGRESS')
            throw new common_1.BadRequestException('Attempt already completed');
        let correctCount = 0;
        let wrongCount = 0;
        let answeredCount = 0;
        const answerAnalysis = {};
        for (const answer of answers) {
            const quizQuestion = attempt.quiz.quizQuestions.find((qq) => qq.questionId === answer.questionId);
            if (!quizQuestion)
                continue;
            const question = quizQuestion.question;
            let isCorrect = null;
            let score = 0;
            if (question.type === 'MCQ' ||
                question.type === 'TRUE_FALSE' ||
                question.type === 'MULTI_SELECT') {
                const correctOption = question.options.find((o) => o.isCorrect);
                isCorrect = answer.optionId === correctOption?.id;
                score = isCorrect ? question.score : 0;
                answeredCount++;
                if (isCorrect)
                    correctCount++;
                else
                    wrongCount++;
                answerAnalysis[answer.questionId] = {
                    questionId: answer.questionId,
                    isCorrect,
                    score,
                    selectedOptionId: answer.optionId,
                    correctOptionId: correctOption?.id,
                };
            }
            else if (question.type === 'ESSAY') {
                answeredCount++;
                const correctOption = question.options.find((o) => o.isCorrect);
                if (correctOption && answer.essayAnswer) {
                    const submitted = answer.essayAnswer.trim().toLowerCase();
                    const expected = correctOption.text.trim().toLowerCase();
                    isCorrect = submitted === expected;
                    score = isCorrect ? question.score : 0;
                }
                else {
                    isCorrect = answer.essayAnswer ? null : null;
                    score = 0;
                }
                if (isCorrect === true)
                    correctCount++;
                else if (isCorrect === false)
                    wrongCount++;
                answerAnalysis[answer.questionId] = {
                    questionId: answer.questionId,
                    isCorrect,
                    score,
                };
            }
            await this.prisma.studentAnswer.upsert({
                where: {
                    attemptId_questionId: { attemptId, questionId: answer.questionId },
                },
                create: {
                    attemptId,
                    questionId: answer.questionId,
                    optionId: answer.optionId || null,
                    essayAnswer: answer.essayAnswer || null,
                    isCorrect,
                    score,
                },
                update: {
                    optionId: answer.optionId || null,
                    essayAnswer: answer.essayAnswer || null,
                    isCorrect,
                    score,
                },
            });
        }
        const totalQuestions = attempt.quiz.quizQuestions.length;
        const unansweredCount = totalQuestions - answeredCount;
        const totalScore = await this.prisma.studentAnswer.aggregate({
            where: { attemptId },
            _sum: { score: true },
        });
        const maxScore = attempt.quiz.quizQuestions.reduce((sum, qq) => sum + qq.question.score, 0);
        const earnedScore = totalScore._sum.score || 0;
        const percentage = maxScore > 0 ? Math.round((earnedScore / maxScore) * 100) : 0;
        const isPassed = percentage >= attempt.quiz.passingScore;
        const grade = this.calculateGrade(percentage);
        const updated = await this.prisma.quizAttempt.update({
            where: { id: attemptId },
            data: {
                status: 'COMPLETED',
                completedAt: new Date(),
                score: earnedScore,
                percentage,
                answeredCount,
                correctCount,
                isPassed,
            },
        });
        await this.prisma.quizResult.create({
            data: {
                attemptId,
                totalQuestions,
                correctCount,
                wrongCount,
                unansweredCount,
                score: updated.score || 0,
                maxScore,
                percentage: updated.percentage || 0,
                grade,
                isPassed,
                answerAnalysis,
            },
        });
        return this.prisma.quizAttempt.findUnique({
            where: { id: attemptId },
            include: {
                quiz: true,
                answers: { include: { question: true, option: true } },
                quizResult: true,
            },
        });
    }
    async getHistory(userId, quizId) {
        return this.prisma.quizAttempt.findMany({
            where: {
                userId,
                ...(quizId ? { quizId } : {}),
            },
            include: {
                quiz: { select: { id: true, title: true, subject: true } },
                quizResult: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findById(id, userId) {
        const attempt = await this.prisma.quizAttempt.findUnique({
            where: { id },
            include: {
                quiz: {
                    include: {
                        quizQuestions: {
                            include: {
                                question: { include: { options: true } },
                            },
                            orderBy: { order: 'asc' },
                        },
                    },
                },
                answers: { include: { question: true, option: true } },
                quizResult: true,
            },
        });
        if (!attempt)
            throw new common_1.NotFoundException('Attempt not found');
        if (attempt.userId !== userId)
            throw new common_1.ForbiddenException('Not your attempt');
        return attempt;
    }
    calculateGrade(percentage) {
        if (percentage >= 90)
            return 'A';
        if (percentage >= 80)
            return 'B';
        if (percentage >= 70)
            return 'C';
        if (percentage >= 60)
            return 'D';
        return 'E';
    }
};
exports.QuizAttemptService = QuizAttemptService;
exports.QuizAttemptService = QuizAttemptService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QuizAttemptService);
//# sourceMappingURL=quiz-attempt.service.js.map