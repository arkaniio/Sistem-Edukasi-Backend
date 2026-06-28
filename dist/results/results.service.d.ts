import { PrismaService } from '../prisma/prisma.service';
export declare class ResultsService {
    private prisma;
    constructor(prisma: PrismaService);
    getRecentResults(teacherId: string): Promise<({
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
        status: string;
        classSubjectId: string;
        uploadDate: Date;
    })[]>;
    processCsv(teacherId: string, classId: string, subjectId: string): Promise<{
        success: boolean;
        message: string;
        batchId?: undefined;
    } | {
        success: boolean;
        batchId: string;
        message?: undefined;
    }>;
    getStudentEraper(userId: string): Promise<{
        studentInfo: {
            name: string;
            class: string;
            nisn: string;
        };
        academicPerformance: {
            subject: string;
            avg: number;
        }[];
        attendance: {
            total: number;
            present: number;
            percentage: number;
        };
    } | null>;
    private buildEraperReport;
}
