import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ParserJobService } from '../parser-job/parser-job.service';

@Injectable()
export class LearningMaterialService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
    private parserJobService: ParserJobService,
  ) {}

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

  async findById(id: string) {
    const material = await this.prisma.learningMaterial.findUnique({
      where: { id },
      include: {
        uploadedBy: { select: { id: true, firstName: true, lastName: true } },
        parserJob: true,
        classSubject: { include: { class: true, subject: true } },
      },
    });
    if (!material) throw new NotFoundException('Learning material not found');
    return material;
  }

  async upload(
    file: Express.Multer.File,
    body: { title: string; description?: string; classSubjectId?: string },
    userId: string,
  ) {
    if (!file) throw new BadRequestException('No file provided');
    if (file.mimetype !== 'application/pdf')
      throw new BadRequestException('Only PDF files are allowed');

    const uploadResult = await this.cloudinary.uploadFile(
      file,
      'learning-materials',
    );

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

  async delete(id: string) {
    const material = await this.findById(id);
    const publicId = this.cloudinary.getPublicIdFromUrl(material.fileUrl);
    if (publicId) await this.cloudinary.deleteFile(publicId);

    // Delete associated parser jobs first to prevent foreign key violation
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
}
