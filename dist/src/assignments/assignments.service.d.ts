import { PrismaService } from '../prisma/prisma.service';
export declare class AssignmentsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(teacherId?: string): any;
    findForStudent(userId: string): Promise<any>;
    submitAssignment(userId: string, assignmentId: string, data: any): Promise<any>;
    fetchSubmissions(assignmentId: string): Promise<any>;
    gradeSubmission(submissionId: string, data: {
        grade: number;
        feedback?: string;
    }): Promise<any>;
    create(data: any): Promise<any>;
    update(id: string, data: any): any;
    remove(id: string): any;
}
