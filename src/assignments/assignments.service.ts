import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { SubmitAssignmentDto } from './dto/submit-assignment.dto';
import { GradeSubmissionDto } from './dto/grade-submission.dto';

@Injectable()
export class AssignmentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(teacherId?: string) {
    const whereClause = teacherId ? { teacherId } : {};
    return await this.prisma.assignment.findMany({
      where: whereClause,
      include: { classSubject: { include: { class: true, subject: true } } },
      orderBy: { dueDate: 'asc' },
    });
  }

  async findForStudent(userId: string) {
    const student = await this.prisma.student.findUnique({ where: { userId } });
    if (!student || !student.classId) return [];

    const classSubjects = await this.prisma.classSubject.findMany({
      where: { classId: student.classId },
    });
    const classSubjectIds = classSubjects.map((cs) => cs.id);

    const assignments = await this.prisma.assignment.findMany({
      where: { classSubjectId: { in: classSubjectIds } },
      include: {
        classSubject: { include: { subject: true, teacher: true } },
        submissions: {
          where: { studentId: student.id },
        },
      },
      orderBy: { dueDate: 'asc' },
    });

    return assignments.map((a) => ({
      ...a,
      mySubmission: a.submissions[0] ?? null,
    }));
  }

  async submitAssignment(
    userId: string,
    assignmentId: string,
    data: SubmitAssignmentDto,
  ) {
    const student = await this.prisma.student.findUnique({ where: { userId } });
    if (!student) throw new Error('Student not found');

    const assignment = await this.prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: { classSubject: true },
    });

    if (!assignment) throw new Error('Assignment not found');
    if (assignment.classSubject.classId !== student.classId) {
      throw new Error(
        'You are not authorized to submit assignments for this class',
      );
    }

    const existing = await this.prisma.assignmentSubmission.findFirst({
      where: { studentId: student.id, assignmentId },
    });

    if (existing) {
      return await this.prisma.assignmentSubmission.update({
        where: { id: existing.id },
        data: {
          content: data.content || existing.content,
          fileUrl: data.fileUrl || existing.fileUrl,
          submittedAt: new Date(),
        },
      });
    }

    return await this.prisma.assignmentSubmission.create({
      data: {
        assignmentId,
        studentId: student.id,
        content: data.content,
        fileUrl: data.fileUrl,
      },
    });
  }

  async fetchSubmissions(assignmentId: string) {
    return await this.prisma.assignmentSubmission.findMany({
      where: { assignmentId },
      include: { student: { include: { user: true } } },
      orderBy: { submittedAt: 'desc' },
    });
  }

  async gradeSubmission(submissionId: string, data: GradeSubmissionDto) {
    return await this.prisma.assignmentSubmission.update({
      where: { id: submissionId },
      data: { grade: data.grade, feedback: data.feedback },
    });
  }

  async create(data: CreateAssignmentDto & { teacherId: string }) {
    let classSubjectId = data.classSubjectId;

    if (!classSubjectId && data.classId) {
      let cs = await this.prisma.classSubject.findFirst({
        where: { classId: data.classId, teacherId: data.teacherId },
      });

      if (!cs) {
        const teacher = await this.prisma.user.findUnique({
          where: { id: data.teacherId },
        });
        let subject = await this.prisma.subject.findFirst();
        if (!subject) {
          subject = await this.prisma.subject.create({
            data: { name: 'General' },
          });
        }

        cs = await this.prisma.classSubject.create({
          data: {
            classId: data.classId,
            teacherId: data.teacherId,
            subjectId: subject.id,
          },
        });
      }
      classSubjectId = cs.id;
    }

    return await this.prisma.assignment.create({
      data: {
        title: data.title,
        description: data.description,
        dueDate: new Date(data.dueDate),
        classSubjectId: classSubjectId!,
        teacherId: data.teacherId,
      },
    });
  }

  async update(id: string, data: UpdateAssignmentDto) {
    const updateData: Prisma.AssignmentUpdateInput = { ...data };
    if (data.dueDate) updateData.dueDate = new Date(data.dueDate);
    return await this.prisma.assignment.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string) {
    return await this.prisma.assignment.delete({ where: { id } });
  }
}
