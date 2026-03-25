import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AssignmentsService {
  constructor(private prisma: PrismaService) {}

  findAll(teacherId?: string) {
    const whereClause = teacherId ? { teacherId } : {};
    return (this.prisma as any).assignment.findMany({ 
      where: whereClause,
      include: { classSubject: { include: { class: true, subject: true } } }, 
      orderBy: { dueDate: 'asc' } 
    });
  }

  async findForStudent(userId: string) {
    const student = await (this.prisma as any).student.findUnique({ where: { userId } });
    if (!student) return [];

    const classSubjects = await (this.prisma as any).classSubject.findMany({ where: { classId: student.classId } });
    const classSubjectIds = classSubjects.map((cs: any) => cs.id);

    const assignments = await (this.prisma as any).assignment.findMany({
      where: { classSubjectId: { in: classSubjectIds } },
      include: {
        classSubject: { include: { subject: true, teacher: true } },
        submissions: {
          where: { studentId: student.id }
        }
      },
      orderBy: { dueDate: 'asc' }
    });

    return assignments.map((a: any) => ({
      ...a,
      mySubmission: a.submissions[0] || null
    }));
  }

  async submitAssignment(userId: string, assignmentId: string, data: any) {
    const student = await (this.prisma as any).student.findUnique({ where: { userId } });
    if (!student) throw new Error("Student not found");

    const assignment = await (this.prisma as any).assignment.findUnique({
      where: { id: assignmentId },
      include: { classSubject: true }
    });

    if (!assignment) throw new Error("Assignment not found");
    if (assignment.classSubject.classId !== student.classId) {
      throw new Error("You are not authorized to submit assignments for this class");
    }

    const existing = await (this.prisma as any).assignmentSubmission.findFirst({
      where: { studentId: student.id, assignmentId }
    });

    if (existing) {
      return (this.prisma as any).assignmentSubmission.update({
        where: { id: existing.id },
        data: {
          content: data.content || existing.content,
          fileUrl: data.fileUrl || existing.fileUrl,
          submittedAt: new Date()
        }
      });
    }

    return (this.prisma as any).assignmentSubmission.create({
      data: {
        assignmentId,
        studentId: student.id,
        content: data.content,
        fileUrl: data.fileUrl
      }
    });
  }

  async fetchSubmissions(assignmentId: string) {
    return (this.prisma as any).assignmentSubmission.findMany({
      where: { assignmentId },
      include: { student: { include: { user: true } } },
      orderBy: { submittedAt: 'desc' }
    });
  }

  async gradeSubmission(submissionId: string, data: { grade: number, feedback?: string }) {
    return (this.prisma as any).assignmentSubmission.update({
      where: { id: submissionId },
      data: { grade: data.grade, feedback: data.feedback }
    });
  }

  async create(data: any) {
    let classSubjectId = data.classSubjectId;

    if (!classSubjectId && data.classId) {
      // Find or create a default ClassSubject for this class and teacher
      let cs = await (this.prisma as any).classSubject.findFirst({
        where: { classId: data.classId, teacherId: data.teacherId }
      });

      if (!cs) {
        // Find a default subject (or create one)
        let subject = await (this.prisma as any).subject.findFirst();
        if (!subject) {
          subject = await (this.prisma as any).subject.create({ data: { name: 'General' } });
        }
        
        cs = await (this.prisma as any).classSubject.create({
          data: {
            classId: data.classId,
            teacherId: data.teacherId,
            subjectId: subject.id
          }
        });
      }
      classSubjectId = cs.id;
    }

    return (this.prisma as any).assignment.create({ data: {
      title: data.title,
      description: data.description,
      dueDate: new Date(data.dueDate),
      classSubjectId: classSubjectId,
      teacherId: data.teacherId
    }});
  }

  update(id: string, data: any) {
    if(data.dueDate) data.dueDate = new Date(data.dueDate);
    return (this.prisma as any).assignment.update({ where: { id }, data });
  }

  remove(id: string) {
    return (this.prisma as any).assignment.delete({ where: { id } });
  }
}
