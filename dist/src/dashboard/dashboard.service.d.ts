import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getSummary(teacherId: string): Promise<{
        classesCount: any;
        totalStudents: any;
        assignmentCount: any;
        activeCbtCount: any;
    }>;
    getClasses(teacherId: string): Promise<any>;
    getPendingTasks(teacherId: string): Promise<never[]>;
    getStudentSummary(userId: string): Promise<{
        className: any;
        attendanceRate: number;
        pendingAssignments: number;
        completedAssignments: any;
    }>;
    getExportData(teacherId: string): Promise<{
        attendances: any;
        grades: any;
    }>;
}
