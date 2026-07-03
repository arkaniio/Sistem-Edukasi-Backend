import { PrismaService } from '../prisma/prisma.service';
export declare class MyClassesService {
    private prisma;
    constructor(prisma: PrismaService);
    getMyClasses(teacherId: string): Promise<({
        class: {
            _count: {
                students: number;
            };
        } & {
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
    })[]>;
    enroll(teacherId: string, classId: string, subjectId: string): Promise<{
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
    }>;
    unenroll(classSubjectId: string, teacherId: string): Promise<{
        id: string;
        createdAt: Date;
        classId: string;
        subjectId: string;
        teacherId: string;
    }>;
}
