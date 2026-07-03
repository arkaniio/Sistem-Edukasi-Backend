import { QuizService } from './quiz.service';
export declare class QuizController {
    private readonly quizService;
    constructor(quizService: QuizService);
    findAll(status?: string, subjectId?: string, search?: string): Promise<({
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
    findForStudent(user: any): Promise<({
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
    findOne(id: string): Promise<{
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
    create(dto: any, user: any): Promise<{
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
    addQuestions(id: string, dto: {
        questionIds: string[];
    }): Promise<{
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
    removeQuestion(id: string, questionId: string): Promise<{
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
    remove(id: string): Promise<{
        message: string;
    }>;
}
