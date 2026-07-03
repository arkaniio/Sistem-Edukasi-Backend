import { PrismaService } from '../prisma/prisma.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { SubmitAssignmentDto } from './dto/submit-assignment.dto';
import { GradeSubmissionDto } from './dto/grade-submission.dto';
export declare class AssignmentsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(teacherId?: string): Promise<({
        classSubject: {
            class: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                level: string | null;
            };
            subject: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                code: string | null;
                description: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            classId: string;
            subjectId: string;
            teacherId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        classSubjectId: string;
        teacherId: string;
        dueDate: Date;
    })[]>;
    findForStudent(userId: string): Promise<{
        mySubmission: {
            id: string;
            updatedAt: Date;
            studentId: string;
            fileUrl: string | null;
            grade: number | null;
            content: string | null;
            feedback: string | null;
            assignmentId: string;
            submittedAt: Date;
        };
        submissions: {
            id: string;
            updatedAt: Date;
            studentId: string;
            fileUrl: string | null;
            grade: number | null;
            content: string | null;
            feedback: string | null;
            assignmentId: string;
            submittedAt: Date;
        }[];
        classSubject: {
            subject: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                code: string | null;
                description: string | null;
            };
            teacher: {
                id: string;
                email: string;
                password: string;
                firstName: string;
                lastName: string;
                role: import("@prisma/client").$Enums.UserRole;
                avatar: string | null;
                phone: string | null;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            classId: string;
            subjectId: string;
            teacherId: string;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        classSubjectId: string;
        teacherId: string;
        dueDate: Date;
    }[]>;
    submitAssignment(userId: string, assignmentId: string, data: SubmitAssignmentDto): Promise<{
        id: string;
        updatedAt: Date;
        studentId: string;
        fileUrl: string | null;
        grade: number | null;
        content: string | null;
        feedback: string | null;
        assignmentId: string;
        submittedAt: Date;
    }>;
    fetchSubmissions(assignmentId: string): Promise<({
        student: {
            user: {
                id: string;
                email: string;
                password: string;
                firstName: string;
                lastName: string;
                role: import("@prisma/client").$Enums.UserRole;
                avatar: string | null;
                phone: string | null;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
            } | null;
        } & {
            id: string;
            firstName: string;
            lastName: string;
            createdAt: Date;
            updatedAt: Date;
            nisn: string | null;
            classId: string | null;
            userId: string | null;
        };
    } & {
        id: string;
        updatedAt: Date;
        studentId: string;
        fileUrl: string | null;
        grade: number | null;
        content: string | null;
        feedback: string | null;
        assignmentId: string;
        submittedAt: Date;
    })[]>;
    gradeSubmission(submissionId: string, data: GradeSubmissionDto): Promise<{
        id: string;
        updatedAt: Date;
        studentId: string;
        fileUrl: string | null;
        grade: number | null;
        content: string | null;
        feedback: string | null;
        assignmentId: string;
        submittedAt: Date;
    }>;
    create(data: CreateAssignmentDto & {
        teacherId: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        classSubjectId: string;
        teacherId: string;
        dueDate: Date;
    }>;
    update(id: string, data: UpdateAssignmentDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        classSubjectId: string;
        teacherId: string;
        dueDate: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        classSubjectId: string;
        teacherId: string;
        dueDate: Date;
    }>;
}
