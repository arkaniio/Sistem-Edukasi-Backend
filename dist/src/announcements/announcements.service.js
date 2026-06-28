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
exports.AnnouncementsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AnnouncementsService = class AnnouncementsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(userId, role) {
        if (role === 'STUDENT') {
            const student = await this.prisma.student.findUnique({ where: { userId } });
            if (!student)
                return [];
            return this.prisma.announcement.findMany({
                where: {
                    OR: [
                        { classSubject: { classId: student.classId } },
                        { classSubjectId: null }
                    ]
                },
                include: {
                    teacher: { select: { firstName: true, lastName: true } },
                    classSubject: { include: { class: true, subject: true } }
                },
                orderBy: { createdAt: 'desc' }
            });
        }
        return this.prisma.announcement.findMany({
            where: { teacherId: userId },
            include: {
                teacher: { select: { firstName: true, lastName: true } },
                classSubject: { include: { class: true, subject: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async create(teacherId, data) {
        return this.prisma.announcement.create({
            data: {
                title: data.title,
                content: data.content,
                teacherId,
                classSubjectId: data.classSubjectId || null
            }
        });
    }
    async remove(id) {
        return this.prisma.announcement.delete({ where: { id } });
    }
};
exports.AnnouncementsService = AnnouncementsService;
exports.AnnouncementsService = AnnouncementsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnnouncementsService);
//# sourceMappingURL=announcements.service.js.map