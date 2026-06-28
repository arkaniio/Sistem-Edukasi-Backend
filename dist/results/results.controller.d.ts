import { ResultsService } from './results.service';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { UploadCsvDto } from './dto/upload-csv.dto';
export declare class ResultsController {
    private readonly resultsService;
    constructor(resultsService: ResultsService);
    getRecentResults(user: AuthenticatedUser): Promise<({
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
            classId: string;
            id: string;
            subjectId: string;
            teacherId: string;
        };
    } & {
        id: string;
        status: string;
        classSubjectId: string;
        uploadDate: Date;
    })[]>;
    uploadCsv(body: UploadCsvDto, user: AuthenticatedUser): Promise<{
        success: boolean;
        message: string;
        batchId?: undefined;
    } | {
        success: boolean;
        batchId: string;
        message?: undefined;
    }>;
    getEraper(user: AuthenticatedUser): Promise<{
        studentInfo: {
            name: string;
            class: string;
            nisn: string;
        };
        academicPerformance: {
            subject: string;
            avg: number;
        }[];
        attendance: {
            total: number;
            present: number;
            percentage: number;
        };
    } | null>;
}
