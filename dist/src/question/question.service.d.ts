import { PrismaService } from '../prisma/prisma.service';
export declare class QuestionService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(params?: {
        questionBankId?: string;
        type?: string;
    }): Promise<({
        questionBank: {
            id: string;
            title: string;
        };
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
    })[]>;
    findById(id: string): Promise<{
        questionBank: {
            id: string;
            title: string;
        };
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
    update(id: string, dto: any): Promise<{
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
    delete(id: string): Promise<{
        message: string;
    }>;
}
