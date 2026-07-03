import { PrismaService } from '../prisma/prisma.service';
export declare class StudentAnswerService {
    private prisma;
    constructor(prisma: PrismaService);
    findByAttempt(attemptId: string): Promise<({
        question: {
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
        };
        option: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            label: string;
            text: string;
            isCorrect: boolean;
            questionId: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        score: number | null;
        isCorrect: boolean | null;
        questionId: string;
        essayAnswer: string | null;
        attemptId: string;
        optionId: string | null;
    })[]>;
}
