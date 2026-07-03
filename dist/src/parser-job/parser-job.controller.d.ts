import { ParserJobService } from './parser-job.service';
import { ParserStatus } from '@prisma/client';
export declare class ParserJobController {
    private readonly parserJobService;
    constructor(parserJobService: ParserJobService);
    findAll(status?: ParserStatus, user?: any): Promise<{
        id: any;
        status: any;
        errorMessage: any;
        warningMessage: null;
        rawResult: any;
        normalizedResult: any;
        validationErrors: null;
        retryCount: any;
        processedAt: any;
        learningMaterial: {
            id: any;
            title: any;
            fileUrl: any;
        } | null;
        questionBankId: any;
        createdAt: any;
        updatedAt: any;
    }[]>;
    findOne(id: string, user?: any): Promise<{
        id: any;
        status: any;
        errorMessage: any;
        warningMessage: null;
        rawResult: any;
        normalizedResult: any;
        validationErrors: null;
        retryCount: any;
        processedAt: any;
        learningMaterial: {
            id: any;
            title: any;
            fileUrl: any;
        } | null;
        questionBankId: any;
        createdAt: any;
        updatedAt: any;
    }>;
    retry(id: string, user?: any): Promise<{
        id: any;
        status: any;
        errorMessage: any;
        warningMessage: null;
        rawResult: any;
        normalizedResult: any;
        validationErrors: null;
        retryCount: any;
        processedAt: any;
        learningMaterial: {
            id: any;
            title: any;
            fileUrl: any;
        } | null;
        questionBankId: any;
        createdAt: any;
        updatedAt: any;
    }>;
}
