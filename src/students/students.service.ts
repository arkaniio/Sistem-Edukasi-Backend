import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(params?: { classId?: string }) {
    const where: any = {};
    if (params?.classId) where.classId = params.classId;
    return await this.prisma.student.findMany({
      where,
      include: { class: true },
      orderBy: { firstName: 'asc' },
    });
  }

  async create(data: CreateStudentDto) {
    return await this.prisma.student.create({ data });
  }

  async update(id: string, data: UpdateStudentDto) {
    return await this.prisma.student.update({ where: { id }, data });
  }

  async remove(id: string) {
    return await this.prisma.student.delete({ where: { id } });
  }
}
