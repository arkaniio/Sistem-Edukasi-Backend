import { PrismaService } from '../prisma/prisma.service';
export declare class QuestionBankService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(params?: {
        isDraft?: boolean;
        subjectId?: string;
        search?: string;
    }): Promise<({
        parserJobs: ({
            learningMaterial: {
                id: string;
                title: string;
                fileUrl: string;
            };
        } & {
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
        })[];
        _count: {
            questions: number;
        };
        subject: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            code: string | null;
            description: string | null;
        } | null;
        createdBy: {
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
        difficulty: import("@prisma/client").$Enums.Difficulty | null;
        isDraft: boolean;
        createdById: string;
        subjectId: string | null;
    })[]>;
    findById(id: string): Promise<{
        parserJobs: ({
            learningMaterial: {
                id: string;
                title: string;
                fileUrl: string;
            };
        } & {
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
        })[];
        subject: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            code: string | null;
            description: string | null;
        } | null;
        createdBy: {
            id: string;
            firstName: string;
            lastName: string;
        };
        questions: ({
            options: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                label: string;
                text: string;
                isCorrect: boolean;
                questionId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            question: string;
            type: import("@prisma/client").$Enums.QuestionType;
            explanation: string | null;
            score: number;
            tags: string[];
            imageUrl: string | null;
            order: number;
            hash: string;
            questionBankId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        difficulty: import("@prisma/client").$Enums.Difficulty | null;
        isDraft: boolean;
        createdById: string;
        subjectId: string | null;
    }>;
    create(userId: string, dto: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        difficulty: import("@prisma/client").$Enums.Difficulty | null;
        isDraft: boolean;
        createdById: string;
        subjectId: string | null;
    }>;
    update(id: string, dto: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        difficulty: import("@prisma/client").$Enums.Difficulty | null;
        isDraft: boolean;
        createdById: string;
        subjectId: string | null;
    }>;
    publish(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        difficulty: import("@prisma/client").$Enums.Difficulty | null;
        isDraft: boolean;
        createdById: string;
        subjectId: string | null;
    }>;
    delete(id: string): Promise<{
        message: string;
    }>;
    addQuestion(bankId: string, dto: any): Promise<{
        options: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            label: string;
            text: string;
            isCorrect: boolean;
            questionId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        question: string;
        type: import("@prisma/client").$Enums.QuestionType;
        explanation: string | null;
        score: number;
        tags: string[];
        imageUrl: string | null;
        order: number;
        hash: string;
        questionBankId: string;
    }>;
}
