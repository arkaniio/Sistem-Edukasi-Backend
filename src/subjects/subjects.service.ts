import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Injectable()
export class SubjectsService {
  constructor(private prisma: PrismaService) {}

  async findAll(params?: { search?: string }) {
    return this.prisma.subject.findMany({
      where: {
        ...(params?.search
          ? {
              name: { contains: params.search, mode: 'insensitive' },
            }
          : {}),
      },
      include: {
        _count: {
          select: { classes: true, quizzes: true, questionBanks: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string) {
    const subject = await this.prisma.subject.findUnique({
      where: { id },
      include: {
        classes: {
          include: {
            class: true,
            teacher: { select: { id: true, firstName: true, lastName: true } },
          },
        },
        _count: {
          select: { classes: true, quizzes: true, questionBanks: true },
        },
      },
    });
    if (!subject) throw new NotFoundException('Subject not found');
    return subject;
  }

  async create(dto: CreateSubjectDto) {
    return this.prisma.subject.create({
      data: {
        ...dto,
      },
    });
  }

  async update(id: string, dto: UpdateSubjectDto) {
    const subject = await this.prisma.subject.findUnique({ where: { id } });
    if (!subject) throw new NotFoundException('Subject not found');
    return this.prisma.subject.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string) {
    const subject = await this.prisma.subject.findUnique({ where: { id } });
    if (!subject) throw new NotFoundException('Subject not found');
    return this.prisma.subject.delete({ where: { id } });
  }
}
