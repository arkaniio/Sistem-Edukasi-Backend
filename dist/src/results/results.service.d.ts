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
            id: string;
            classId: string;
            subjectId: string;
            teacherId: string;
        };
    } & {
        id: string;
        status: string;
        classSubjectId: string;
        uploadDate: Date;
    })[]>;
    processCsv(teacherId: string, classId: string, subjectId: string, file: any): Promise<{
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
            class: any;
            nisn: any;
        };
        academicPerformance: {
            subject: string;
            avg: number;
        }[];
        attendance: {
            total: any;
            present: any;
            percentage: number;
        };
    } | null>;
}
