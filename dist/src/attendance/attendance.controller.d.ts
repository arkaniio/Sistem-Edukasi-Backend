import { AttendanceService } from './attendance.service';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    findAll(user: AuthenticatedUser, classId?: string, date?: string, studentId?: string): Promise<({
        class: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            level: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        classId: string;
        date: Date;
        status: import("@prisma/client").$Enums.AttendanceStatus;
        studentId: string;
    })[]>;
    getStudentAttendance(user: AuthenticatedUser, classId?: string, month?: string): Promise<({
        class: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            level: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        classId: string;
        date: Date;
        status: import("@prisma/client").$Enums.AttendanceStatus;
        studentId: string;
    })[]>;
    getSummary(classId: string, month?: string): Promise<Record<string, number>>;
    getStats(classId?: string, date?: string): Promise<{
        overview: {
            present: number;
            absent: number;
            late: number;
        };
        avgEntryTime: string;
        totalRecords: number;
        presentPercentage: number;
        lateEntries: number;
        perfectRecords: number;
    }>;
    markAttendance(body: {
        classId: string;
        date: string;
        records: {
            studentId: string;
            status: any;
        }[];
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        classId: string;
        date: Date;
        status: import("@prisma/client").$Enums.AttendanceStatus;
        studentId: string;
    }[]>;
    markStudentAttendance(user: AuthenticatedUser, status?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        classId: string;
        date: Date;
        status: import("@prisma/client").$Enums.AttendanceStatus;
        studentId: string;
    }>;
    updateStatus(id: string, status: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        classId: string;
        date: Date;
        status: import("@prisma/client").$Enums.AttendanceStatus;
        studentId: string;
    }>;
}
