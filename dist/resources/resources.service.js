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
exports.ResourcesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ResourcesService = class ResourcesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getResources(teacherId) {
        return await this.prisma.resource.findMany({
            where: { teacherId },
            include: { classSubject: { include: { class: true, subject: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createResource(teacherId, data, fileUrl) {
        return await this.prisma.resource.create({
            data: {
                title: data.title,
                type: data.type,
                description: data.description,
                accessLevel: data.accessLevel,
                fileUrl,
                teacherId,
                classSubjectId: data.classSubjectId,
            },
        });
    }
    async getResourcesByClassSubject(csId) {
        return await this.prisma.resource.findMany({
            where: { classSubjectId: csId },
            include: { teacher: { select: { firstName: true, lastName: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getResourcesForStudent(userId) {
        const student = await this.prisma.student.findUnique({
            where: { userId },
        });
        if (!student)
            return [];
        return await this.prisma.resource.findMany({
            where: { classSubject: { classId: student.classId } },
            include: {
                teacher: { select: { firstName: true, lastName: true } },
                classSubject: { include: { subject: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.ResourcesService = ResourcesService;
exports.ResourcesService = ResourcesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ResourcesService);
//# sourceMappingURL=resources.service.js.map