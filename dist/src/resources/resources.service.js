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
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
let ResourcesService = class ResourcesService {
    prisma;
    cloudinary;
    constructor(prisma, cloudinary) {
        this.prisma = prisma;
        this.cloudinary = cloudinary;
    }
    async getResources(teacherId) {
        return await this.prisma.resource.findMany({
            where: { teacherId },
            include: { classSubject: { include: { class: true, subject: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createResource(teacherId, data, file) {
        if (!file) {
            throw new common_1.BadRequestException('No file provided');
        }
        const uploadResult = await this.cloudinary.uploadFile(file, 'resources');
        console.log(uploadResult);
        return await this.prisma.resource.create({
            data: {
                title: data.title,
                type: data.type,
                description: data.description,
                fileUrl: uploadResult.secure_url,
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
        if (!student || !student.classId)
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
    async deleteResource(id) {
        const resource = await this.prisma.resource.findUnique({
            where: { id },
        });
        if (resource) {
            const publicId = this.cloudinary.getPublicIdFromUrl(resource.fileUrl);
            if (publicId) {
                await this.cloudinary.deleteFile(publicId);
            }
        }
        return await this.prisma.resource.delete({
            where: { id },
        });
    }
};
exports.ResourcesService = ResourcesService;
exports.ResourcesService = ResourcesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cloudinary_service_1.CloudinaryService])
], ResourcesService);
//# sourceMappingURL=resources.service.js.map