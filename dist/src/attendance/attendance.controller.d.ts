import { AttendanceService } from './attendance.service';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    findAll(req: any): Promise<any>;
    create(data: any): any;
    markAttendance(req: any, body: {
        status?: string;
    }): Promise<any>;
}
