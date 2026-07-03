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
exports.ClassesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ClassesService = class ClassesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return await this.prisma.class.findMany({
            include: { _count: { select: { students: true, subjects: true } } },
            orderBy: { name: 'asc' },
        });
    }
    async findById(id) {
        const classData = await this.prisma.class.findUnique({
            where: { id },
            include: {
                students: {
                    include: { user: { select: { id: true, email: true } } },
                },
                subjects: {
                    include: {
                        subject: true,
                        teacher: { select: { id: true, firstName: true, lastName: true } },
                    },
                },
                _count: { select: { students: true, subjects: true } },
            },
        });
        if (!classData)
            throw new Error('Class not found');
        return classData;
    }
    async create(data) {
        return await this.prisma.class.create({
            data,
        });
    }
    async update(id, data) {
        return await this.prisma.class.update({ where: { id }, data });
    }
    async remove(id) {
        return await this.prisma.class.delete({ where: { id } });
    }
    async addSubject(classId, dto) {
        return await this.prisma.classSubject.create({
            data: {
                classId,
                subjectId: dto.subjectId,
                teacherId: dto.teacherId,
            },
            include: {
                subject: true,
                teacher: { select: { id: true, firstName: true, lastName: true } },
            },
        });
    }
    async removeSubject(classId, classSubjectId) {
        return await this.prisma.classSubject.delete({
            where: { id: classSubjectId, classId },
        });
    }
    async addStudent(classId, studentId) {
        return await this.prisma.student.update({
            where: { id: studentId },
            data: { classId },
        });
    }
    async removeStudent(classId, studentId) {
        return await this.prisma.student.update({
            where: { id: studentId, classId },
            data: { classId: null },
        });
    }
};
exports.ClassesService = ClassesService;
exports.ClassesService = ClassesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ClassesService);
//# sourceMappingURL=classes.service.js.map