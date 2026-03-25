import { PrismaService } from '../prisma/prisma.service';
export declare class AttendanceService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(teacherId?: string): Promise<any>;
    create(data: any): any;
    findForStudent(userId: string): Promise<any>;
    markStudentAttendance(userId: string, status?: string): Promise<any>;
}
