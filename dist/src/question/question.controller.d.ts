import { QuestionService } from './question.service';
export declare class QuestionController {
    private readonly questionService;
    constructor(questionService: QuestionService);
    findAll(questionBankId?: string, type?: string): Promise<({
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
    findOne(id: string): Promise<{
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
    remove(id: string): Promise<{
        message: string;
    }>;
}
