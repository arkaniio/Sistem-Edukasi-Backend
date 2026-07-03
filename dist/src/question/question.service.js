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
exports.QuestionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let QuestionService = class QuestionService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(params) {
        const where = {};
        if (params?.questionBankId)
            where.questionBankId = params.questionBankId;
        if (params?.type)
            where.type = params.type;
        return this.prisma.question.findMany({
            where,
            include: {
                options: { orderBy: { label: 'asc' } },
                questionBank: { select: { id: true, title: true } },
            },
            orderBy: { order: 'asc' },
        });
    }
    async findById(id) {
        const question = await this.prisma.question.findUnique({
            where: { id },
            include: {
                options: { orderBy: { label: 'asc' } },
                questionBank: { select: { id: true, title: true } },
            },
        });
        if (!question)
            throw new common_1.NotFoundException('Question not found');
        return question;
    }
    async update(id, dto) {
        await this.findById(id);
        if (dto.options) {
            await this.prisma.option.deleteMany({ where: { questionId: id } });
            await this.prisma.question.update({
                where: { id },
                data: {
                    question: dto.question,
                    explanation: dto.explanation,
                    score: dto.score,
                    tags: dto.tags,
                    imageUrl: dto.imageUrl,
                    options: {
                        create: dto.options.map((opt, i) => ({
                            label: opt.label || String.fromCharCode(65 + i),
                            text: opt.text,
                            isCorrect: opt.isCorrect || false,
                        })),
                    },
                },
                include: { options: true },
            });
        }
        return this.prisma.question.update({
            where: { id },
            data: {
                question: dto.question,
                explanation: dto.explanation,
                score: dto.score,
                tags: dto.tags,
                imageUrl: dto.imageUrl,
            },
            include: { options: true },
        });
    }
    async delete(id) {
        await this.findById(id);
        await this.prisma.option.deleteMany({ where: { questionId: id } });
        await this.prisma.question.delete({ where: { id } });
        return { message: 'Question deleted' };
    }
};
exports.QuestionService = QuestionService;
exports.QuestionService = QuestionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QuestionService);
//# sourceMappingURL=question.service.js.map