import { PrismaService } from '../prisma/prisma.service';
export declare class CbtService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(teacherId: string): Promise<any>;
    findOne(id: string): Promise<any>;
    create(teacherId: string, data: any): Promise<any>;
    update(id: string, data: any): Promise<any>;
    remove(id: string): Promise<any>;
    addQuestion(testId: string, data: any): Promise<any>;
    updateQuestion(id: string, data: any): Promise<any>;
    deleteQuestion(id: string): Promise<any>;
    findForStudent(userId: string): Promise<any>;
    startAttempt(userId: string, testId: string): Promise<any>;
    submitAttempt(userId: string, attemptId: string, answers: any): Promise<any>;
    getAttemptsByTest(testId: string): Promise<any>;
    updateAttemptGrade(attemptId: string, data: any): Promise<any>;
}
