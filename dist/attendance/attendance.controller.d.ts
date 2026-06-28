import { AttendanceService } from './attendance.service';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    findAll(user: AuthenticatedUser): Promise<({
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
    markAttendance(user: AuthenticatedUser, body: MarkAttendanceDto): Promise<{
        classId: string;
        id: string;
        studentId: string;
        status: string;
        date: Date;
    }>;
}
