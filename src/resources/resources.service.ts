import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ResourcesService {
  constructor(private prisma: PrismaService) {}

  async getResources(teacherId: string) {
    return (this.prisma as any).resource.findMany({
      where: { teacherId },
      include: { 
        teacher: { select: { firstName: true, lastName: true } },
        classSubject: { include: { class: true, subject: true } } 
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async createResource(teacherId: string, data: any, fileUrl: string) {
    return (this.prisma as any).resource.create({
      data: {
        title: data.title,
        type: data.type,
        description: data.description,
        accessLevel: data.accessLevel,
        fileUrl,
        teacherId,
        classSubjectId: data.classSubjectId
      }
    });
  }

  async getResourcesByClassSubject(csId: string) {
    return (this.prisma as any).resource.findMany({
      where: { classSubjectId: csId },
      include: { teacher: { select: { firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getResourcesForStudent(userId: string) {
    const student = await (this.prisma as any).student.findUnique({ where: { userId } });
    if (!student) return [];

    return (this.prisma as any).resource.findMany({
      where: { classSubject: { classId: student.classId } },
      include: { teacher: { select: { firstName: true, lastName: true } }, classSubject: { include: { subject: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }
}
