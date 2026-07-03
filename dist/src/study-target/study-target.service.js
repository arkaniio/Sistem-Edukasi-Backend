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
exports.StudyTargetService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let StudyTargetService = class StudyTargetService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getTargets(userId) {
        const student = await this.prisma.student.findUnique({ where: { userId } });
        if (!student) {
            return [];
        }
        return this.prisma.studyTarget.findMany({
            where: { studentId: student.id },
            orderBy: [{ isCompleted: 'asc' }, { createdAt: 'desc' }],
        });
    }
    async createTarget(userId, dto) {
        const student = await this.prisma.student.findUnique({ where: { userId } });
        if (!student) {
            throw new common_1.NotFoundException('Student profile not found');
        }
        return this.prisma.studyTarget.create({
            data: {
                studentId: student.id,
                title: dto.title,
                description: dto.description,
                period: dto.period,
            },
        });
    }
    async toggleTarget(id) {
        const target = await this.prisma.studyTarget.findUnique({ where: { id } });
        if (!target) {
            throw new common_1.NotFoundException('Study target not found');
        }
        return this.prisma.studyTarget.update({
            where: { id },
            data: { isCompleted: !target.isCompleted },
        });
    }
    async deleteTarget(id) {
        const target = await this.prisma.studyTarget.findUnique({ where: { id } });
        if (!target) {
            throw new common_1.NotFoundException('Study target not found');
        }
        return this.prisma.studyTarget.delete({ where: { id } });
    }
};
exports.StudyTargetService = StudyTargetService;
exports.StudyTargetService = StudyTargetService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StudyTargetService);
//# sourceMappingURL=study-target.service.js.map