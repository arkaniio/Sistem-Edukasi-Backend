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
exports.MyClassesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MyClassesService = class MyClassesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMyClasses(teacherId) {
        return this.prisma.classSubject.findMany({
            where: { teacherId },
            include: {
                class: {
                    include: {
                        _count: { select: { students: true } },
                    },
                },
                subject: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async enroll(teacherId, classId, subjectId) {
        const cls = await this.prisma.class.findUnique({ where: { id: classId } });
        if (!cls)
            throw new common_1.NotFoundException('Class not found');
        const subject = await this.prisma.subject.findUnique({ where: { id: subjectId } });
        if (!subject)
            throw new common_1.NotFoundException('Subject not found');
        const existing = await this.prisma.classSubject.findFirst({
            where: { classId, subjectId, teacherId },
        });
        if (existing)
            throw new common_1.ConflictException('You are already enrolled in this class-subject combination');
        return this.prisma.classSubject.create({
            data: { classId, subjectId, teacherId },
            include: {
                class: true,
                subject: true,
            },
        });
    }
    async unenroll(classSubjectId, teacherId) {
        const cs = await this.prisma.classSubject.findFirst({
            where: { id: classSubjectId, teacherId },
        });
        if (!cs)
            throw new common_1.NotFoundException('Enrollment not found or you do not have permission');
        return this.prisma.classSubject.delete({ where: { id: classSubjectId } });
    }
};
exports.MyClassesService = MyClassesService;
exports.MyClassesService = MyClassesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MyClassesService);
//# sourceMappingURL=my-classes.service.js.map