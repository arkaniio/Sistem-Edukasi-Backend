import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MyClassesService {
  constructor(private prisma: PrismaService) {}

  /** Get all class-subjects this teacher is enrolled in */
  async getMyClasses(teacherId: string) {
    return this.prisma.classSubject.findMany({
      where: { teacherId },
      include: {
        class: {
          include: {
            _count: { select: { students: true } },
          },
        },
        subject: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /** Enroll a teacher into a class-subject */
  async enroll(teacherId: string, classId: string, subjectId: string) {
    // Verify class and subject exist
    const cls = await this.prisma.class.findUnique({ where: { id: classId } });
    if (!cls) throw new NotFoundException('Class not found');

    const subject = await this.prisma.subject.findUnique({ where: { id: subjectId } });
    if (!subject) throw new NotFoundException('Subject not found');

    // Check for duplicate
    const existing = await this.prisma.classSubject.findFirst({
      where: { classId, subjectId, teacherId },
    });
    if (existing) throw new ConflictException('You are already enrolled in this class-subject combination');

    return this.prisma.classSubject.create({
      data: { classId, subjectId, teacherId },
      include: {
        class: true,
        subject: true,
      },
    });
  }

  /** Un-enroll a teacher from a class-subject */
  async unenroll(classSubjectId: string, teacherId: string) {
    const cs = await this.prisma.classSubject.findFirst({
      where: { id: classSubjectId, teacherId },
    });
    if (!cs) throw new NotFoundException('Enrollment not found or you do not have permission');

    return this.prisma.classSubject.delete({ where: { id: classSubjectId } });
  }
}
