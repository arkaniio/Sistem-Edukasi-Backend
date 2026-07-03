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
exports.LearningMaterialService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
const parser_job_service_1 = require("../parser-job/parser-job.service");
let LearningMaterialService = class LearningMaterialService {
    prisma;
    cloudinary;
    parserJobService;
    constructor(prisma, cloudinary, parserJobService) {
        this.prisma = prisma;
        this.cloudinary = cloudinary;
        this.parserJobService = parserJobService;
    }
    async findAll() {
        return this.prisma.learningMaterial.findMany({
            include: {
                uploadedBy: { select: { id: true, firstName: true, lastName: true } },
                parserJob: { select: { id: true, status: true } },
                classSubject: { include: { class: true, subject: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findById(id) {
        const material = await this.prisma.learningMaterial.findUnique({
            where: { id },
            include: {
                uploadedBy: { select: { id: true, firstName: true, lastName: true } },
                parserJob: true,
                classSubject: { include: { class: true, subject: true } },
            },
        });
        if (!material)
            throw new common_1.NotFoundException('Learning material not found');
        return material;
    }
    async upload(file, body, userId) {
        if (!file)
            throw new common_1.BadRequestException('No file provided');
        if (file.mimetype !== 'application/pdf')
            throw new common_1.BadRequestException('Only PDF files are allowed');
        const uploadResult = await this.cloudinary.uploadFile(file, 'learning-materials');
        const material = await this.prisma.learningMaterial.create({
            data: {
                title: body.title,
                description: body.description,
                fileUrl: uploadResult.secure_url,
                pageCount: null,
                uploadedById: userId,
                classSubjectId: body.classSubjectId || null,
            },
        });
        await this.parserJobService.create(material.id, userId);
        return this.prisma.learningMaterial.findUnique({
            where: { id: material.id },
            include: { parserJob: true },
        });
    }
    async delete(id) {
        const material = await this.findById(id);
        const publicId = this.cloudinary.getPublicIdFromUrl(material.fileUrl);
        if (publicId)
            await this.cloudinary.deleteFile(publicId);
        await this.prisma.parserJob.deleteMany({
            where: { learningMaterialId: id },
        });
        await this.prisma.learningMaterial.delete({
            where: {
                id: id,
            },
        });
        return { message: 'Learning material deleted' };
    }
};
exports.LearningMaterialService = LearningMaterialService;
exports.LearningMaterialService = LearningMaterialService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cloudinary_service_1.CloudinaryService,
        parser_job_service_1.ParserJobService])
], LearningMaterialService);
//# sourceMappingURL=learning-material.service.js.map