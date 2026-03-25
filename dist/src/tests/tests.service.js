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
exports.TestsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TestsService = class TestsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getTests(teacherId) {
        return this.prisma.cBTTest.findMany({
            where: { teacherId },
            include: { classSubject: { include: { class: true, subject: true } } },
            orderBy: { scheduledDate: 'desc' }
        });
    }
    async createTest(teacherId, data) {
        const { title, durationMins, instructions, scheduledDate, classSubjectId, questions } = data;
        return this.prisma.cBTTest.create({
            data: {
                title,
                durationMins: Number(durationMins) || 60,
                instructions,
                scheduledDate: new Date(scheduledDate),
                status: 'ACTIVE',
                teacherId,
                classSubjectId,
                questions: {
                    create: questions ? questions.map((q) => ({
                        question: q.text,
                        points: Number(q.points) || 1,
                        options: q.options || []
                    })) : []
                }
            }
        });
    }
};
exports.TestsService = TestsService;
exports.TestsService = TestsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TestsService);
//# sourceMappingURL=tests.service.js.map