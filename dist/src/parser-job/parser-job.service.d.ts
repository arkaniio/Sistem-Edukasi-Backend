import { PrismaService } from '../prisma/prisma.service';
import { ParserStatus } from '@prisma/client';
export declare class ParserJobService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    findAll(status?: ParserStatus, userId?: string): Promise<{
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
    findById(id: string, userId?: string): Promise<{
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
    create(learningMaterialId: string, createdById: string): Promise<{
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
    retry(id: string, userId?: string): Promise<{
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
    startParsing(id: string): Promise<void>;
    private mapQuestionType;
    private mapToDto;
}
