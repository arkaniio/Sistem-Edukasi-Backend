import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getSummary(): Promise<{
        classesCount: number;
        totalStudents: number;
        assignmentCount: number;
    }>;
    getClasses(): Promise<({
        _count: {
            students: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        level: string | null;
    })[]>;
    getPendingTasks(): never[];
    getAdminStats(): Promise<{
        totalUsers: number;
        totalStudents: number;
        totalTeachers: number;
        totalQuizzes: number;
        totalClasses: number;
        totalSubjects: number;
        recentUsers: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: import("@prisma/client").$Enums.UserRole;
            avatar: string | null;
            isActive: boolean;
            createdAt: Date;
        }[];
    }>;
    getTeacherStats(teacherUserId: string, timeframe?: string): Promise<{
        totalClasses: number;
        totalSubjects: number;
        totalStudents: number;
        totalQuizzes: number;
        totalAssignments: number;
        recentQuizzes: ({
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
        })[];
        avgAttendance: number;
        attendanceChange: number;
        studentChange: number;
        activeClasses: number;
        participationTrends: {
            day: string;
            peak: number;
            average: number;
        }[];
        recentPerformance: {
            id: any;
            firstName: any;
            lastName: any;
            className: any;
            avgScore: any;
            attendance: number;
        }[];
    }>;
    getStudentStats(userId: string): Promise<{
        className: string;
        attendanceRate: number;
        pendingAssignments: number;
        completedAssignments: number;
        totalAttempts: number;
        completedAttempts: number;
        averageScore: number;
        passedCount: number;
        recentResults: ({
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
        attendanceStats: {
            status: import("@prisma/client").$Enums.AttendanceStatus;
            _count: number;
        }[];
    }>;
    getExportData(): Promise<{
        attendances: ({
            student: {
                id: string;
                firstName: string;
                lastName: string;
                createdAt: Date;
                updatedAt: Date;
                nisn: string | null;
                classId: string | null;
                userId: string | null;
            };
            class: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                level: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            classId: string;
            date: Date;
            status: import("@prisma/client").$Enums.AttendanceStatus;
            studentId: string;
        })[];
        grades: ({
            student: {
                id: string;
                firstName: string;
                lastName: string;
                createdAt: Date;
                updatedAt: Date;
                nisn: string | null;
                classId: string | null;
                userId: string | null;
            };
            assignment: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                title: string;
                classSubjectId: string;
                teacherId: string;
                dueDate: Date;
            };
        } & {
            id: string;
            updatedAt: Date;
            studentId: string;
            fileUrl: string | null;
            grade: number | null;
            content: string | null;
            feedback: string | null;
            assignmentId: string;
            submittedAt: Date;
        })[];
    }>;
}
