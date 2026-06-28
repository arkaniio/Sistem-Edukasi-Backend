import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getSummary(): Promise<{
        classesCount: number;
        totalStudents: number;
        assignmentCount: number;
    }>;
    getClasses(): Promise<({
        _count: {
            students: number;
        };
    } & {
        id: string;
        name: string;
    })[]>;
    getPendingTasks(): never[];
    getStudentSummary(userId: string): Promise<{
        className: string;
        attendanceRate: number;
        pendingAssignments: number;
        completedAssignments: number;
    }>;
    getExportData(): Promise<{
        attendances: ({
            class: {
                id: string;
                name: string;
            };
            student: {
                firstName: string;
                lastName: string;
                classId: string;
                id: string;
                userId: string | null;
            };
        } & {
            classId: string;
            id: string;
            studentId: string;
            status: string;
            date: Date;
        })[];
        grades: ({
            student: {
                firstName: string;
                lastName: string;
                classId: string;
                id: string;
                userId: string | null;
            };
            assignment: {
                id: string;
                teacherId: string;
                classSubjectId: string;
                title: string;
                description: string | null;
                dueDate: Date;
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
        })[];
    }>;
}
