import { PrismaService } from '../prisma/prisma.service';
export declare class QuizService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(params?: {
        status?: string;
        subjectId?: string;
        search?: string;
    }): Promise<({
        _count: {
            quizAttempts: number;
            quizQuestions: number;
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
        status: import("@prisma/client").$Enums.QuizStatus;
        description: string | null;
        title: string;
        difficulty: import("@prisma/client").$Enums.Difficulty;
        createdById: string;
        subjectId: string | null;
        timeLimit: number | null;
        passingScore: number;
        shuffleQuestions: boolean;
        shuffleOptions: boolean;
        showResults: boolean;
        maxAttempts: number;
        publishedAt: Date | null;
        learningMaterialId: string | null;
    })[]>;
    findForStudent(userId: string): Promise<({
        quizAttempts: {
            id: string;
            status: import("@prisma/client").$Enums.AttemptStatus;
            score: number | null;
            percentage: number | null;
            attemptNumber: number;
            completedAt: Date | null;
        }[];
        _count: {
            quizQuestions: number;
        };
        subject: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            code: string | null;
            description: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.QuizStatus;
        description: string | null;
        title: string;
        difficulty: import("@prisma/client").$Enums.Difficulty;
        createdById: string;
        subjectId: string | null;
        timeLimit: number | null;
        passingScore: number;
        shuffleQuestions: boolean;
        shuffleOptions: boolean;
        showResults: boolean;
        maxAttempts: number;
        publishedAt: Date | null;
        learningMaterialId: string | null;
    })[]>;
    findById(id: string): Promise<{
        _count: {
            quizAttempts: number;
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
        quizQuestions: ({
            question: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            score: number;
            order: number;
            quizId: string;
            questionId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.QuizStatus;
        description: string | null;
        title: string;
        difficulty: import("@prisma/client").$Enums.Difficulty;
        createdById: string;
        subjectId: string | null;
        timeLimit: number | null;
        passingScore: number;
        shuffleQuestions: boolean;
        shuffleOptions: boolean;
        showResults: boolean;
        maxAttempts: number;
        publishedAt: Date | null;
        learningMaterialId: string | null;
    }>;
    create(userId: string, dto: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.QuizStatus;
        description: string | null;
        title: string;
        difficulty: import("@prisma/client").$Enums.Difficulty;
        createdById: string;
        subjectId: string | null;
        timeLimit: number | null;
        passingScore: number;
        shuffleQuestions: boolean;
        shuffleOptions: boolean;
        showResults: boolean;
        maxAttempts: number;
        publishedAt: Date | null;
        learningMaterialId: string | null;
    }>;
    update(id: string, dto: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.QuizStatus;
        description: string | null;
        title: string;
        difficulty: import("@prisma/client").$Enums.Difficulty;
        createdById: string;
        subjectId: string | null;
        timeLimit: number | null;
        passingScore: number;
        shuffleQuestions: boolean;
        shuffleOptions: boolean;
        showResults: boolean;
        maxAttempts: number;
        publishedAt: Date | null;
        learningMaterialId: string | null;
    }>;
    publish(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.QuizStatus;
        description: string | null;
        title: string;
        difficulty: import("@prisma/client").$Enums.Difficulty;
        createdById: string;
        subjectId: string | null;
        timeLimit: number | null;
        passingScore: number;
        shuffleQuestions: boolean;
        shuffleOptions: boolean;
        showResults: boolean;
        maxAttempts: number;
        publishedAt: Date | null;
        learningMaterialId: string | null;
    }>;
    close(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.QuizStatus;
        description: string | null;
        title: string;
        difficulty: import("@prisma/client").$Enums.Difficulty;
        createdById: string;
        subjectId: string | null;
        timeLimit: number | null;
        passingScore: number;
        shuffleQuestions: boolean;
        shuffleOptions: boolean;
        showResults: boolean;
        maxAttempts: number;
        publishedAt: Date | null;
        learningMaterialId: string | null;
    }>;
    addQuestions(quizId: string, questionIds: string[]): Promise<{
        _count: {
            quizAttempts: number;
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
        quizQuestions: ({
            question: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            score: number;
            order: number;
            quizId: string;
            questionId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.QuizStatus;
        description: string | null;
        title: string;
        difficulty: import("@prisma/client").$Enums.Difficulty;
        createdById: string;
        subjectId: string | null;
        timeLimit: number | null;
        passingScore: number;
        shuffleQuestions: boolean;
        shuffleOptions: boolean;
        showResults: boolean;
        maxAttempts: number;
        publishedAt: Date | null;
        learningMaterialId: string | null;
    }>;
    removeQuestion(quizId: string, questionId: string): Promise<{
        _count: {
            quizAttempts: number;
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
        quizQuestions: ({
            question: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            score: number;
            order: number;
            quizId: string;
            questionId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.QuizStatus;
        description: string | null;
        title: string;
        difficulty: import("@prisma/client").$Enums.Difficulty;
        createdById: string;
        subjectId: string | null;
        timeLimit: number | null;
        passingScore: number;
        shuffleQuestions: boolean;
        shuffleOptions: boolean;
        showResults: boolean;
        maxAttempts: number;
        publishedAt: Date | null;
        learningMaterialId: string | null;
    }>;
    delete(id: string): Promise<{
        message: string;
    }>;
}
