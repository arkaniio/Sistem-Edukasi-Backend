"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionBankService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const crypto = __importStar(require("crypto"));
let QuestionBankService = class QuestionBankService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(params) {
        const where = {};
        if (params?.isDraft !== undefined)
            where.isDraft = params.isDraft;
        if (params?.subjectId)
            where.subjectId = params.subjectId;
        if (params?.search) {
            where.OR = [
                { title: { contains: params.search, mode: 'insensitive' } },
                { description: { contains: params.search, mode: 'insensitive' } },
            ];
        }
        return this.prisma.questionBank.findMany({
            where,
            include: {
                _count: { select: { questions: true } },
                subject: true,
                createdBy: { select: { id: true, firstName: true, lastName: true } },
                parserJobs: {
                    include: {
                        learningMaterial: {
                            select: {
                                id: true,
                                title: true,
                                fileUrl: true,
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findById(id) {
        const bank = await this.prisma.questionBank.findUnique({
            where: { id },
            include: {
                questions: {
                    include: { options: { orderBy: { label: 'asc' } } },
                    orderBy: { order: 'asc' },
                },
                subject: true,
                createdBy: { select: { id: true, firstName: true, lastName: true } },
                parserJobs: {
                    include: {
                        learningMaterial: {
                            select: {
                                id: true,
                                title: true,
                                fileUrl: true,
                            },
                        },
                    },
                },
            },
        });
        if (!bank)
            throw new common_1.NotFoundException('Question bank not found');
        return bank;
    }
    async create(userId, dto) {
        return this.prisma.questionBank.create({
            data: {
                title: dto.title,
                description: dto.description,
                difficulty: dto.difficulty,
                subjectId: dto.subjectId,
                createdById: userId,
                isDraft: true,
            },
        });
    }
    async update(id, dto) {
        await this.findById(id);
        return this.prisma.questionBank.update({ where: { id }, data: dto });
    }
    async publish(id) {
        await this.findById(id);
        return this.prisma.questionBank.update({
            where: { id },
            data: { isDraft: false },
        });
    }
    async delete(id) {
        await this.findById(id);
        await this.prisma.option.deleteMany({
            where: { question: { questionBankId: id } },
        });
        await this.prisma.question.deleteMany({
            where: { questionBankId: id },
        });
        await this.prisma.questionBank.delete({ where: { id } });
        return { message: 'Question bank deleted' };
    }
    async addQuestion(bankId, dto) {
        await this.findById(bankId);
        const contentToHash = JSON.stringify({
            question: dto.question,
            options: dto.options,
            type: dto.type,
        });
        const hash = crypto
            .createHash('sha256')
            .update(contentToHash)
            .digest('hex');
        const existing = await this.prisma.question.findUnique({
            where: {
                hash_questionBankId: {
                    hash,
                    questionBankId: bankId,
                },
            },
        });
        if (existing) {
            throw new common_1.ConflictException('Duplicate question: same question already exists in this bank');
        }
        const lastQuestion = await this.prisma.question.findFirst({
            where: {
                questionBankId: bankId,
            },
            orderBy: {
                order: 'desc',
            },
        });
        const nextOrder = (lastQuestion?.order ?? 0) + 1;
        return this.prisma.question.create({
            data: {
                question: dto.question,
                type: dto.type || 'MCQ',
                explanation: dto.explanation,
                score: dto.score || 1,
                tags: dto.tags || [],
                imageUrl: dto.imageUrl,
                order: nextOrder,
                hash,
                questionBankId: bankId,
                options: dto.options
                    ? {
                        create: dto.options.map((opt, i) => ({
                            label: opt.label || String.fromCharCode(65 + i),
                            text: opt.text,
                            isCorrect: !!opt.isCorrect,
                        })),
                    }
                    : undefined,
            },
            include: {
                options: true,
            },
        });
    }
};
exports.QuestionBankService = QuestionBankService;
exports.QuestionBankService = QuestionBankService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QuestionBankService);
//# sourceMappingURL=question-bank.service.js.map