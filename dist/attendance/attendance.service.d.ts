import { PrismaService } from '../prisma/prisma.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
export declare class AttendanceService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(userId: string): Promise<({
        class: {
            id: string;
            name: string;
        };
    } & {
        classId: string;
        id: string;
        studentId: string;
        status: string;
        date: Date;
    })[]>;
    create(data: CreateAttendanceDto): Promise<{
        classId: string;
        id: string;
        studentId: string;
        status: string;
        date: Date;
    }>;
    markStudentAttendance(userId: string, status?: string): Promise<{
        classId: string;
        id: string;
        studentId: string;
        status: string;
        date: Date;
    }>;
}
