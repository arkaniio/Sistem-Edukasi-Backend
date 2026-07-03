import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { StudyTargetService } from './study-target.service';
import { CreateStudyTargetDto } from './dto/create-study-target.dto';
export declare class StudyTargetController {
    private readonly studyTargetService;
    constructor(studyTargetService: StudyTargetService);
    getTargets(user: AuthenticatedUser): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        description: string | null;
        title: string;
        period: import("@prisma/client").$Enums.StudyTargetPeriod;
        isCompleted: boolean;
    }[]>;
    createTarget(user: AuthenticatedUser, dto: CreateStudyTargetDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        description: string | null;
        title: string;
        period: import("@prisma/client").$Enums.StudyTargetPeriod;
        isCompleted: boolean;
    }>;
    toggleTarget(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        description: string | null;
        title: string;
        period: import("@prisma/client").$Enums.StudyTargetPeriod;
        isCompleted: boolean;
    }>;
    deleteTarget(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        description: string | null;
        title: string;
        period: import("@prisma/client").$Enums.StudyTargetPeriod;
        isCompleted: boolean;
    }>;
}
