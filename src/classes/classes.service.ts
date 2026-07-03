import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

@Injectable()
export class ClassesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.class.findMany({
      include: { _count: { select: { students: true, subjects: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string) {
    const classData = await this.prisma.class.findUnique({
      where: { id },
      include: {
        students: {
          include: { user: { select: { id: true, email: true } } },
        },
        subjects: {
          include: {
            subject: true,
            teacher: { select: { id: true, firstName: true, lastName: true } },
          },
        },
        _count: { select: { students: true, subjects: true } },
      },
    });

    if (!classData) throw new Error('Class not found');
    return classData;
  }

  async create(data: CreateClassDto) {
    return await this.prisma.class.create({
      data,
    });
  }

  async update(id: string, data: UpdateClassDto) {
    return await this.prisma.class.update({ where: { id }, data });
  }

  async remove(id: string) {
    return await this.prisma.class.delete({ where: { id } });
  }

  async addSubject(
    classId: string,
    dto: { subjectId: string; teacherId: string },
  ) {
    return await this.prisma.classSubject.create({
      data: {
        classId,
        subjectId: dto.subjectId,
        teacherId: dto.teacherId,
      },
      include: {
        subject: true,
        teacher: { select: { id: true, firstName: true, lastName: true } },
      },
    });
  }

  async removeSubject(classId: string, classSubjectId: string) {
    return await this.prisma.classSubject.delete({
      where: { id: classSubjectId, classId },
    });
  }

  async addStudent(classId: string, studentId: string) {
    return await this.prisma.student.update({
      where: { id: studentId },
      data: { classId },
    });
  }

  async removeStudent(classId: string, studentId: string) {
    return await this.prisma.student.update({
      where: { id: studentId, classId },
      data: { classId: null },
    });
  }
}
