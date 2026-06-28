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
            subject: {
                id: string;
                name: string;
            };
            class: {
                id: string;
                name: string;
            };
        } & {
            classId: string;
            id: string;
            subjectId: string;
            teacherId: string;
        };
    } & {
        id: string;
        teacherId: string;
        classSubjectId: string;
        title: string;
        description: string | null;
        dueDate: Date;
    })[]>;
    findForStudent(userId: string): Promise<{
        mySubmission: {
            id: string;
            studentId: string;
            assignmentId: string;
            fileUrl: string | null;
            content: string | null;
            grade: number | null;
            feedback: string | null;
            submittedAt: Date;
        };
        classSubject: {
            subject: {
                id: string;
                name: string;
            };
            teacher: {
                email: string;
                password: string;
                firstName: string;
                lastName: string;
                role: string;
                avatar: string | null;
                id: string;
            };
        } & {
            classId: string;
            id: string;
            subjectId: string;
            teacherId: string;
        };
        submissions: {
            id: string;
            studentId: string;
            assignmentId: string;
            fileUrl: string | null;
            content: string | null;
            grade: number | null;
            feedback: string | null;
            submittedAt: Date;
        }[];
        id: string;
        teacherId: string;
        classSubjectId: string;
        title: string;
        description: string | null;
        dueDate: Date;
    }[]>;
    submitAssignment(userId: string, assignmentId: string, data: SubmitAssignmentDto): Promise<{
        id: string;
        studentId: string;
        assignmentId: string;
        fileUrl: string | null;
        content: string | null;
        grade: number | null;
        feedback: string | null;
        submittedAt: Date;
    }>;
    fetchSubmissions(assignmentId: string): Promise<({
        student: {
            user: {
                email: string;
                password: string;
                firstName: string;
                lastName: string;
                role: string;
                avatar: string | null;
                id: string;
            } | null;
        } & {
            firstName: string;
            lastName: string;
            classId: string;
            id: string;
            userId: string | null;
        };
    } & {
        id: string;
        studentId: string;
        assignmentId: string;
        fileUrl: string | null;
        content: string | null;
        grade: number | null;
        feedback: string | null;
        submittedAt: Date;
    })[]>;
    gradeSubmission(submissionId: string, data: GradeSubmissionDto): Promise<{
        id: string;
        studentId: string;
        assignmentId: string;
        fileUrl: string | null;
        content: string | null;
        grade: number | null;
        feedback: string | null;
        submittedAt: Date;
    }>;
    create(data: CreateAssignmentDto & {
        teacherId: string;
    }): Promise<{
        id: string;
        teacherId: string;
        classSubjectId: string;
        title: string;
        description: string | null;
        dueDate: Date;
    }>;
    update(id: string, data: UpdateAssignmentDto): Promise<{
        id: string;
        teacherId: string;
        classSubjectId: string;
        title: string;
        description: string | null;
        dueDate: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        teacherId: string;
        classSubjectId: string;
        title: string;
        description: string | null;
        dueDate: Date;
    }>;
}
