import { LearningMaterialService } from './learning-material.service';
export declare class LearningMaterialController {
    private readonly learningMaterialService;
    constructor(learningMaterialService: LearningMaterialService);
    findAll(): Promise<({
        parserJob: {
            id: string;
            status: import("@prisma/client").$Enums.ParserStatus;
        } | null;
        classSubject: ({
            class: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                level: string | null;
            };
            subject: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                code: string | null;
                description: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            classId: string;
            subjectId: string;
            teacherId: string;
        }) | null;
        uploadedBy: {
            id: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        fileSize: number | null;
        fileUrl: string;
        publicId: string | null;
        pageCount: number | null;
        mimeType: string | null;
        uploadedById: string;
        classSubjectId: string | null;
    })[]>;
    findOne(id: string): Promise<{
        parserJob: {
            error: string | null;
            result: import("@prisma/client/runtime/library").JsonValue | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.ParserStatus;
            createdById: string;
            questionBankId: string | null;
            learningMaterialId: string;
            retryCount: number;
        } | null;
        classSubject: ({
            class: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                level: string | null;
            };
            subject: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                code: string | null;
                description: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            classId: string;
            subjectId: string;
            teacherId: string;
        }) | null;
        uploadedBy: {
            id: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        fileSize: number | null;
        fileUrl: string;
        publicId: string | null;
        pageCount: number | null;
        mimeType: string | null;
        uploadedById: string;
        classSubjectId: string | null;
    }>;
    upload(file: Express.Multer.File, body: {
        title: string;
        description?: string;
        classSubjectId?: string;
    }, user: any): Promise<({
        parserJob: {
            error: string | null;
            result: import("@prisma/client/runtime/library").JsonValue | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.ParserStatus;
            createdById: string;
            questionBankId: string | null;
            learningMaterialId: string;
            retryCount: number;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        fileSize: number | null;
        fileUrl: string;
        publicId: string | null;
        pageCount: number | null;
        mimeType: string | null;
        uploadedById: string;
        classSubjectId: string | null;
    }) | null>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
