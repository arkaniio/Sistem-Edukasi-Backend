import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateResourceDto } from './dto/create-resource.dto';

@Injectable()
export class ResourcesService {
  constructor(private prisma: PrismaService) {}

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
    fileUrl: string,
  ) {
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
    if (!student) return [];

    return await this.prisma.resource.findMany({
      where: { classSubject: { classId: student.classId } },
      include: {
        teacher: { select: { firstName: true, lastName: true } },
        classSubject: { include: { subject: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
