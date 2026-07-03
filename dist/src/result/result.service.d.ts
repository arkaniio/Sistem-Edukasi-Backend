import { PrismaService } from '../prisma/prisma.service';
export declare class ResultService {
    private prisma;
    constructor(prisma: PrismaService);
    getQuizResults(quizId: string): Promise<{
        quiz: {
            id: string;
            title: string;
        };
        stats: {
            totalAttempts: number;
            completedAttempts: number;
            averagePercentage: number;
            averageScore: number;
            passRate: number;
            totalStudents: number;
        };
        attempts: ({
            student: {
                id: string;
                firstName: string;
                lastName: string;
                nisn: string | null;
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
        })[];
    }>;
    getStudentResults(userId: string): Promise<{
        results: ({
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
                passingScore: number;
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
        })[];
    }>;
    getGradeReport(userId: string): Promise<{
        summary: {
            totalQuizzes: number;
            passed: number;
            failed: number;
            avgScore: number;
            totalScore: number;
        };
        subjectBreakdown: {
            subject: string;
            attempts: number;
            averagePercentage: number;
        }[];
        recentAttempts: ({
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
        })[];
        results: ({
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
        })[];
    }>;
}
