import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnnouncementsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, role: string) {
    if (role === 'STUDENT') {
      const student = await (this.prisma as any).student.findUnique({ where: { userId } });
      if (!student) return [];
      
      return (this.prisma as any).announcement.findMany({
        where: {
          OR: [
            { classSubject: { classId: student.classId } },
            { classSubjectId: null } // School-wide
          ]
        },
        include: {
          teacher: { select: { firstName: true, lastName: true } },
          classSubject: { include: { class: true, subject: true } }
        },
        orderBy: { createdAt: 'desc' }
      });
    }

    return (this.prisma as any).announcement.findMany({
      where: { teacherId: userId },
      include: {
        teacher: { select: { firstName: true, lastName: true } },
        classSubject: { include: { class: true, subject: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async create(teacherId: string, data: any) {
    return (this.prisma as any).announcement.create({
      data: {
        title: data.title,
        content: data.content,
        teacherId,
        classSubjectId: data.classSubjectId || null // null means school-wide
      }
    });
  }

  async remove(id: string) {
    return (this.prisma as any).announcement.delete({ where: { id } });
  }
}
