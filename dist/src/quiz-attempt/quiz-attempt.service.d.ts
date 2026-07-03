import { PrismaService } from '../prisma/prisma.service';
export declare class QuizAttemptService {
    private prisma;
    constructor(prisma: PrismaService);
    startAttempt(userId: string, quizId: string): Promise<{
        quiz: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: import("@prisma/client").$Enums.AttemptStatus;
        studentId: string;
        score: number | null;
        quizId: string;
        percentage: number | null;
        totalQuestions: number;
        answeredCount: number;
        correctCount: number;
        isPassed: boolean | null;
        attemptNumber: number;
        startedAt: Date;
        completedAt: Date | null;
    }>;
    submitAttempt(userId: string, attemptId: string, answers: {
        questionId: string;
        optionId?: string;
        essayAnswer?: string;
    }[]): Promise<({
        quiz: {
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
        };
        quizResult: {
            id: string;
            createdAt: Date;
            score: number;
            percentage: number;
            totalQuestions: number;
            correctCount: number;
            isPassed: boolean;
            attemptId: string;
            wrongCount: number;
            unansweredCount: number;
            maxScore: number;
            grade: string | null;
            answerAnalysis: import("@prisma/client/runtime/library").JsonValue | null;
        } | null;
        answers: ({
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
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: import("@prisma/client").$Enums.AttemptStatus;
        studentId: string;
        score: number | null;
        quizId: string;
        percentage: number | null;
        totalQuestions: number;
        answeredCount: number;
        correctCount: number;
        isPassed: boolean | null;
        attemptNumber: number;
        startedAt: Date;
        completedAt: Date | null;
    }) | null>;
    getHistory(userId: string, quizId?: string): Promise<({
        quiz: {
            id: string;
            subject: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                code: string | null;
                description: string | null;
            } | null;
            title: string;
        };
        quizResult: {
            id: string;
            createdAt: Date;
            score: number;
            percentage: number;
            totalQuestions: number;
            correctCount: number;
            isPassed: boolean;
            attemptId: string;
            wrongCount: number;
            unansweredCount: number;
            maxScore: number;
            grade: string | null;
            answerAnalysis: import("@prisma/client/runtime/library").JsonValue | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: import("@prisma/client").$Enums.AttemptStatus;
        studentId: string;
        score: number | null;
        quizId: string;
        percentage: number | null;
        totalQuestions: number;
        answeredCount: number;
        correctCount: number;
        isPassed: boolean | null;
        attemptNumber: number;
        startedAt: Date;
        completedAt: Date | null;
    })[]>;
    findById(id: string, userId: string): Promise<{
        quiz: {
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
        };
        quizResult: {
            id: string;
            createdAt: Date;
            score: number;
            percentage: number;
            totalQuestions: number;
            correctCount: number;
            isPassed: boolean;
            attemptId: string;
            wrongCount: number;
            unansweredCount: number;
            maxScore: number;
            grade: string | null;
            answerAnalysis: import("@prisma/client/runtime/library").JsonValue | null;
        } | null;
        answers: ({
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
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: import("@prisma/client").$Enums.AttemptStatus;
        studentId: string;
        score: number | null;
        quizId: string;
        percentage: number | null;
        totalQuestions: number;
        answeredCount: number;
        correctCount: number;
        isPassed: boolean | null;
        attemptNumber: number;
        startedAt: Date;
        completedAt: Date | null;
    }>;
    private calculateGrade;
}
