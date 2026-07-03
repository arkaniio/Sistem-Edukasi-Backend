import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudyTargetDto } from './dto/create-study-target.dto';

@Injectable()
export class StudyTargetService {
  constructor(private prisma: PrismaService) {}

  async getTargets(userId: string) {
    const student = await this.prisma.student.findUnique({ where: { userId } });

    if (!student) {
      return [];
    }

    return this.prisma.studyTarget.findMany({
      where: { studentId: student.id },
      orderBy: [{ isCompleted: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async createTarget(userId: string, dto: CreateStudyTargetDto) {
    const student = await this.prisma.student.findUnique({ where: { userId } });

    if (!student) {
      throw new NotFoundException('Student profile not found');
    }

    return this.prisma.studyTarget.create({
      data: {
        studentId: student.id,
        title: dto.title,
        description: dto.description,
        period: dto.period,
      },
    });
  }

  async toggleTarget(id: string) {
    const target = await this.prisma.studyTarget.findUnique({ where: { id } });

    if (!target) {
      throw new NotFoundException('Study target not found');
    }

    return this.prisma.studyTarget.update({
      where: { id },
      data: { isCompleted: !target.isCompleted },
    });
  }

  async deleteTarget(id: string) {
    const target = await this.prisma.studyTarget.findUnique({ where: { id } });

    if (!target) {
      throw new NotFoundException('Study target not found');
    }

    return this.prisma.studyTarget.delete({ where: { id } });
  }
}
