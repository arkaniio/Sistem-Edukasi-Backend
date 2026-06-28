import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';

@Injectable()
export class AnnouncementsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    const findUser = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (findUser?.role === 'STUDENT') {
      const student = await this.prisma.student.findUnique({
        where: { userId },
      });
      if (!student) return [];

      return await this.prisma.announcement.findMany({
        where: {
          OR: [
            { classSubject: { classId: student.classId } },
            { classSubjectId: null },
          ],
        },
        include: {
          teacher: { select: { firstName: true, lastName: true } },
          classSubject: { include: { class: true, subject: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    return await this.prisma.announcement.findMany({
      where: { teacherId: userId },
      include: {
        teacher: { select: { firstName: true, lastName: true } },
        classSubject: { include: { class: true, subject: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(teacherId: string, data: CreateAnnouncementDto) {
    return await this.prisma.announcement.create({
      data: {
        title: data.title,
        content: data.content,
        teacherId,
        classSubjectId: data.classSubjectId || null,
      },
    });
  }

  async remove(id: string) {
    return await this.prisma.announcement.delete({ where: { id } });
  }
}
