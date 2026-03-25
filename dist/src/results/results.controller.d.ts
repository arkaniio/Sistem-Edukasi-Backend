import { ResultsService } from './results.service';
export declare class ResultsController {
    private readonly resultsService;
    constructor(resultsService: ResultsService);
    getRecentResults(req: any): Promise<({
        classSubject: {
            subject: {
                id: string;
                name: string;
            };
            class: {
                id: string;
                name: string;
            };
        } & {
            id: string;
            classId: string;
            subjectId: string;
            teacherId: string;
        };
    } & {
        id: string;
        status: string;
        classSubjectId: string;
        uploadDate: Date;
    })[]>;
    uploadCsv(file: any, body: any, req: any): Promise<{
        success: boolean;
        message: string;
        batchId?: undefined;
    } | {
        success: boolean;
        batchId: string;
        message?: undefined;
    }>;
    getEraper(req: any): Promise<{
        studentInfo: {
            name: string;
            class: any;
            nisn: any;
        };
        academicPerformance: {
            subject: string;
            avg: number;
        }[];
        attendance: {
            total: any;
            present: any;
            percentage: number;
        };
    } | null>;
}
