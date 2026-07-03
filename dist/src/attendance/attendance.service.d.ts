import { $Enums } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
export declare class AttendanceService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(userId: string, params?: {
        classId?: string;
        date?: string;
        studentId?: string;
    }): Promise<({
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
        status: $Enums.AttendanceStatus;
        studentId: string;
    })[]>;
    create(data: CreateAttendanceDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        classId: string;
        date: Date;
        status: $Enums.AttendanceStatus;
        studentId: string;
    }>;
    markBulkAttendance(classId: string, date: string, records: {
        studentId: string;
        status: any;
    }[]): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        classId: string;
        date: Date;
        status: $Enums.AttendanceStatus;
        studentId: string;
    }[]>;
    updateStatus(id: string, status: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        classId: string;
        date: Date;
        status: $Enums.AttendanceStatus;
        studentId: string;
    }>;
    getStudentAttendance(userId: string, classId?: string, month?: string): Promise<({
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
        status: $Enums.AttendanceStatus;
        studentId: string;
    })[]>;
    getSummary(classId: string, month?: string): Promise<Record<string, number>>;
    markStudentAttendance(userId: string, status?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        classId: string;
        date: Date;
        status: $Enums.AttendanceStatus;
        studentId: string;
    }>;
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
}
