import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getSummary(req: any): Promise<{
        classesCount: any;
        totalStudents: any;
        assignmentCount: any;
        activeCbtCount: any;
    }>;
    getClasses(req: any): Promise<any>;
    getPendingTasks(req: any): Promise<never[]>;
    getStudentSummary(req: any): Promise<{
        className: any;
        attendanceRate: number;
        pendingAssignments: number;
        completedAssignments: any;
    }>;
    exportData(req: any): Promise<{
        attendances: any;
        grades: any;
    }>;
}
