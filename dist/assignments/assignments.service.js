"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AssignmentsService = class AssignmentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(teacherId) {
        const whereClause = teacherId ? { teacherId } : {};
        return await this.prisma.assignment.findMany({
            where: whereClause,
            include: { classSubject: { include: { class: true, subject: true } } },
            orderBy: { dueDate: 'asc' },
        });
    }
    async findForStudent(userId) {
        const student = await this.prisma.student.findUnique({ where: { userId } });
        if (!student)
            return [];
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
    async submitAssignment(userId, assignmentId, data) {
        const student = await this.prisma.student.findUnique({ where: { userId } });
        if (!student)
            throw new Error('Student not found');
        const assignment = await this.prisma.assignment.findUnique({
            where: { id: assignmentId },
            include: { classSubject: true },
        });
        if (!assignment)
            throw new Error('Assignment not found');
        if (assignment.classSubject.classId !== student.classId) {
            throw new Error('You are not authorized to submit assignments for this class');
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
    async fetchSubmissions(assignmentId) {
        return await this.prisma.assignmentSubmission.findMany({
            where: { assignmentId },
            include: { student: { include: { user: true } } },
            orderBy: { submittedAt: 'desc' },
        });
    }
    async gradeSubmission(submissionId, data) {
        return await this.prisma.assignmentSubmission.update({
            where: { id: submissionId },
            data: { grade: data.grade, feedback: data.feedback },
        });
    }
    async create(data) {
        let classSubjectId = data.classSubjectId;
        if (!classSubjectId && data.classId) {
            let cs = await this.prisma.classSubject.findFirst({
                where: { classId: data.classId, teacherId: data.teacherId },
            });
            if (!cs) {
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
                classSubjectId: classSubjectId,
                teacherId: data.teacherId,
            },
        });
    }
    async update(id, data) {
        const updateData = { ...data };
        if (data.dueDate)
            updateData.dueDate = new Date(data.dueDate);
        return await this.prisma.assignment.update({
            where: { id },
            data: updateData,
        });
    }
    async remove(id) {
        return await this.prisma.assignment.delete({ where: { id } });
    }
};
exports.AssignmentsService = AssignmentsService;
exports.AssignmentsService = AssignmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AssignmentsService);
//# sourceMappingURL=assignments.service.js.map