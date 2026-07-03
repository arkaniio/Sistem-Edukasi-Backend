import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class ResourcesService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async getResources(teacherId: string) {
    return await this.prisma.resource.findMany({
      where: { teacherId },
      include: { classSubject: { include: { class: true, subject: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createResource(
    teacherId: string,
    data: CreateResourceDto,
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
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

  async getResourcesByClassSubject(csId: string) {
    return await this.prisma.resource.findMany({
      where: { classSubjectId: csId },
      include: { teacher: { select: { firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getResourcesForStudent(userId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
    });
    if (!student || !student.classId) return [];

    return await this.prisma.resource.findMany({
      where: { classSubject: { classId: student.classId } },
      include: {
        teacher: { select: { firstName: true, lastName: true } },
        classSubject: { include: { subject: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteResource(id: string) {
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
}
