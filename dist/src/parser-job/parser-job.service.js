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
var ParserJobService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParserJobService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const crypto = __importStar(require("crypto"));
let ParserJobService = ParserJobService_1 = class ParserJobService {
    prisma;
    logger = new common_1.Logger(ParserJobService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(status, userId) {
        const where = {};
        if (status)
            where.status = status;
        if (userId)
            where.createdById = userId;
        const jobs = await this.prisma.parserJob.findMany({
            where,
            include: {
                learningMaterial: {
                    select: { id: true, title: true, fileUrl: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return jobs.map((job) => this.mapToDto(job));
    }
    async findById(id, userId) {
        const where = { id };
        if (userId)
            where.createdById = userId;
        const job = await this.prisma.parserJob.findFirst({
            where,
            include: {
                learningMaterial: {
                    select: { id: true, title: true, fileUrl: true },
                },
            },
        });
        if (!job)
            throw new common_1.NotFoundException('Parser job not found');
        return this.mapToDto(job);
    }
    async create(learningMaterialId, createdById) {
        const job = await this.prisma.parserJob.create({
            data: {
                status: client_1.ParserStatus.PENDING,
                learningMaterialId,
                createdById,
            },
            include: {
                learningMaterial: {
                    select: { id: true, title: true, fileUrl: true },
                },
            },
        });
        this.startParsing(job.id).catch((err) => {
            this.logger.error(`Background parsing failed: ${err.message}`, err.stack);
        });
        return this.mapToDto(job);
    }
    async retry(id, userId) {
        const where = { id };
        if (userId)
            where.createdById = userId;
        const job = await this.prisma.parserJob.findFirst({
            where,
            include: {
                learningMaterial: {
                    select: { id: true, title: true, fileUrl: true },
                },
            },
        });
        if (!job)
            throw new common_1.NotFoundException('Parser job not found');
        const updatedJob = await this.prisma.parserJob.update({
            where: { id },
            data: {
                status: client_1.ParserStatus.PENDING,
                error: null,
                retryCount: job.retryCount + 1,
            },
            include: {
                learningMaterial: {
                    select: { id: true, title: true, fileUrl: true },
                },
            },
        });
        this.startParsing(updatedJob.id).catch((err) => {
            this.logger.error(`Background parsing failed: ${err.message}`, err.stack);
        });
        return this.mapToDto(updatedJob);
    }
    async startParsing(id) {
        const job = await this.prisma.parserJob.findUnique({
            where: { id },
            include: {
                learningMaterial: {
                    include: {
                        classSubject: true,
                    },
                },
            },
        });
        if (!job)
            return;
        try {
            await this.prisma.parserJob.update({
                where: { id },
                data: { status: client_1.ParserStatus.PROCESSING },
            });
            const parserUrl = process.env.PARSER_SERVICE_URL || 'http://localhost:8000/parse-pdf';
            this.logger.log(`Sending parse request to: ${parserUrl} | PDF: ${job.learningMaterial.fileUrl}`);
            const response = await fetch(parserUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ pdfUrl: job.learningMaterial.fileUrl }),
            });
            if (!response.ok) {
                throw new Error(`Parser service responded with status ${response.status}`);
            }
            const result = await response.json();
            if (!result.success) {
                throw new Error(result.message || 'Unknown parser error');
            }
            const resultData = result.data;
            const parsedQuestions = resultData.questions || [];
            const title = resultData.title || job.learningMaterial.title || 'Parsed Question Bank';
            const questionBank = await this.prisma.questionBank.create({
                data: {
                    title,
                    description: resultData.description || `Parsed from PDF: ${job.learningMaterial.title}`,
                    createdById: job.createdById,
                    isDraft: true,
                    subjectId: job.learningMaterial.classSubject?.subjectId || null,
                },
            });
            const seenHashes = new Set();
            let order = 1;
            for (const q of parsedQuestions) {
                const mappedType = this.mapQuestionType(q.type);
                const optionsList = q.options || [];
                let formattedOptions = optionsList.map((opt, index) => ({
                    label: opt.label || String.fromCharCode(65 + index),
                    text: opt.text || '',
                    isCorrect: !!opt.isCorrect,
                }));
                if (mappedType === client_1.QuestionType.ESSAY && q.answer) {
                    formattedOptions.push({
                        label: 'Kunci',
                        text: q.answer,
                        isCorrect: true,
                    });
                }
                const contentToHash = JSON.stringify({
                    question: q.question,
                    options: formattedOptions,
                    type: mappedType,
                });
                const hash = crypto
                    .createHash('sha256')
                    .update(contentToHash)
                    .digest('hex');
                if (seenHashes.has(hash)) {
                    this.logger.warn(`Skipping duplicate question hash in bank: ${hash}`);
                    continue;
                }
                seenHashes.add(hash);
                await this.prisma.question.create({
                    data: {
                        question: q.question,
                        type: mappedType,
                        explanation: q.explanation || null,
                        score: q.score || 1,
                        tags: q.tags || [],
                        order: order++,
                        hash,
                        questionBankId: questionBank.id,
                        options: formattedOptions.length > 0 ? {
                            create: formattedOptions,
                        } : undefined,
                    },
                });
            }
            await this.prisma.parserJob.update({
                where: { id },
                data: {
                    status: client_1.ParserStatus.SUCCESS,
                    questionBankId: questionBank.id,
                    result: resultData,
                },
            });
            this.logger.log(`Parser job ${id} completed successfully. Created bank: ${questionBank.id}`);
        }
        catch (err) {
            this.logger.error(`Error processing parser job ${id}: ${err.message}`, err.stack);
            await this.prisma.parserJob.update({
                where: { id },
                data: {
                    status: client_1.ParserStatus.FAILED,
                    error: err.message || 'Unknown processing error',
                },
            });
        }
    }
    mapQuestionType(pyType) {
        const typeMap = {
            MULTIPLE_CHOICE: client_1.QuestionType.MCQ,
            MULTIPLE_SELECT: client_1.QuestionType.MULTI_SELECT,
            TRUE_FALSE: client_1.QuestionType.TRUE_FALSE,
            ESSAY: client_1.QuestionType.ESSAY,
            BENAR_SALAH_KOMPLEKS: client_1.QuestionType.MULTI_SELECT,
        };
        return typeMap[pyType] || client_1.QuestionType.MCQ;
    }
    mapToDto(job) {
        return {
            id: job.id,
            status: job.status,
            errorMessage: job.error,
            warningMessage: null,
            rawResult: job.result,
            normalizedResult: job.result,
            validationErrors: null,
            retryCount: job.retryCount,
            processedAt: job.updatedAt,
            learningMaterial: job.learningMaterial ? {
                id: job.learningMaterial.id,
                title: job.learningMaterial.title,
                fileUrl: job.learningMaterial.fileUrl,
            } : null,
            questionBankId: job.questionBankId,
            createdAt: job.createdAt,
            updatedAt: job.updatedAt,
        };
    }
};
exports.ParserJobService = ParserJobService;
exports.ParserJobService = ParserJobService = ParserJobService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ParserJobService);
//# sourceMappingURL=parser-job.service.js.map